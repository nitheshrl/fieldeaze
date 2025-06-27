import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Linking, Alert } from 'react-native';
import mockDataRaw from '../mockData.json';

const mockData: any = mockDataRaw;

const BOT_COLOR = '#27537B';
const USER_COLOR = '#f2f2f2';
const SUPPORT_PHONE = '+919677782813';

// Helper: flatten all FAQs from services and global
const getAllFaqs = (): { q: string; a: string; service?: string }[] => {
  let faqs: { q: string; a: string; service?: string }[] = [];
  if ((mockData as any).faqs) faqs = faqs.concat((mockData as any).faqs);
  if (mockData.services && mockData.serviceDetails) {
    Object.values<any>(mockData.serviceDetails).forEach((svc: any) => {
      if (svc.faqs) {
        svc.faqs.forEach((f: any) => {
          faqs.push({ q: f.question || f.q, a: f.answer || f.a, service: svc.name });
        });
      }
    });
  }
  return faqs;
};

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  quickReplies?: string[];
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your Fieldeaze assistant. How can I help you today?\nYou can ask about services, offers, or type 'help' for options.", sender: 'bot', quickReplies: ["Show services", "Show offers", "FAQs"] }
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Main bot logic: generate a reply based on user input
  const getBotReply = (userMsg: string): { text: string; quickReplies?: string[] } => {
    const text = userMsg.toLowerCase();
    // 1. Greetings
    if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) {
      return { text: "Hello! How can I assist you today?", quickReplies: ["Show services", "Show offers", "FAQs", "Call Support"] };
    }
    // 2. Show all services
    if (text.includes('service')) {
      const names = mockData.services.map((s: any) => s.name).join(', ');
      return { text: `Here are our top services: ${names}.\nType a service name to know more.`, quickReplies: mockData.services.slice(0, 4).map((s: any) => s.name) };
    }
    // 3. Show offers
    if (text.includes('offer') || text.includes('discount')) {
      if (mockData.offers && mockData.offers.length > 0) {
        return { text: `Current offers:\n- ${mockData.offers.join('\n- ')}` };
      } else {
        return { text: "No offers available right now." };
      }
    }
    // 4. FAQs
    if (text.includes('faq') || text.includes('question')) {
      const faqs = getAllFaqs().slice(0, 3);
      return { text: faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n'), quickReplies: ["More FAQs"] };
    }
    if (text.includes('more faq')) {
      const faqs = getAllFaqs().slice(3, 8);
      return { text: faqs.length ? faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n') : "No more FAQs." };
    }
    // 5. Service details
    const service = mockData.services.find((s: any) => {
      const serviceName = s.name.toLowerCase();
      return text.includes(serviceName) || serviceName.includes(text);
    });
    if (service && mockData.serviceDetails[service.id]) {
      const details = mockData.serviceDetails[service.id];
      let reply = `${details.name}: ${details.description}\nPopular packs: `;
      if (details.superSaverPacks && details.superSaverPacks.length) {
        reply += details.superSaverPacks.map((p: any) => `${p.name} (${p.price})`).join(', ');
      }
      if (details.faqs && details.faqs.length) {
        reply += `\nExample FAQ: ${details.faqs[0].question} - ${details.faqs[0].answer}`;
      }
      return { text: reply, quickReplies: ["Book now", "Show more", "FAQs"] };
    }
    // 6. Book/Reschedule/Cancel
    if (/\b(book now)\b/.test(text)) {
      // Show address options from mockData
      const addresses = (mockData.user && mockData.user.addresses) ? mockData.user.addresses.map((a: any) => a.address) : [];
      return {
        text: "Please choose an address for your booking or use your live location:",
        quickReplies: [...addresses, "Use live location"]
      };
    }
    if (/\b(book|reschedule|cancel)\b/.test(text)) {
      return { text: "To book, reschedule, or cancel a service, please use the booking section in the app. Would you like to see available services?", quickReplies: ["Show services"] };
    }
    // 7. Feedback
    if (text.includes('feedback') || text.includes('complaint')) {
      return { text: "We value your feedback! Please type your feedback or complaint, and our team will review it." };
    }
    // 8. Escalate to human
    if (text.includes('human') || text.includes('agent') || text.includes('support')) {
      return { text: "Connecting you to a human agent. Please wait..." };
    }
    // 9. Help
    if (text.includes('help')) {
      return { text: "You can ask about services, offers, FAQs, or type a service name to know more. Try: 'Show services', 'Show offers', or 'AC Service'." };
    }
    // 10. Fallback
    return { text: "Sorry, I didn't understand that. You can ask about services, offers, or type 'help' for options.", quickReplies: ["Show services", "Show offers", "FAQs", "Call Support"] };
  };

  // Handle sending a message
  const sendMessage = (msgText: string) => {
    if (!msgText.trim()) return;
    // Handle Call Support quick reply
    if (msgText === 'Call Support') {
      Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
        Alert.alert('Error', 'Unable to make a call from this device.')
      );
      return;
    }
    const userMsg: Message = { id: Date.now(), text: msgText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Check if the previous message was the address selection prompt
    const lastBotMsg = messages[messages.length - 1];
    if (
      lastBotMsg &&
      lastBotMsg.sender === 'bot' &&
      lastBotMsg.text.includes('Please choose an address for your booking') &&
      (lastBotMsg.quickReplies || []).includes(msgText)
    ) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, text: 'Your service has been booked!', sender: 'bot' }
        ]);
      }, 600);
      return;
    }
    // Simulate bot thinking
    setTimeout(() => {
      const botReply = getBotReply(msgText);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply.text, sender: 'bot', quickReplies: botReply.quickReplies }]);
    }, 600);
  };

  // Render each message bubble
  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.bubble,
      item.sender === 'bot' ? styles.botBubble : styles.userBubble
    ]}>
      <Text style={[
        styles.bubbleText,
        item.sender === 'bot' ? styles.botText : styles.userText
      ]}>
        {item.text}
      </Text>
      {/* Quick replies for bot messages */}
      {item.quickReplies && (
        <View style={styles.quickReplies}>
          {item.quickReplies.map((qr, idx) => (
            <TouchableOpacity key={idx} style={styles.quickReplyBtn} onPress={() => sendMessage(qr)}>
              <Text style={styles.quickReplyText}>{qr}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 16, paddingBottom: 80 },
  bubble: { maxWidth: '80%', marginVertical: 6, padding: 12, borderRadius: 16 },
  botBubble: { backgroundColor: BOT_COLOR, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: USER_COLOR, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 16 },
  botText: { color: '#fff' },
  userText: { color: '#222' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, fontSize: 16, marginRight: 8 },
  sendBtn: { backgroundColor: BOT_COLOR, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
  quickReplies: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  quickReplyBtn: { backgroundColor: '#fff', borderColor: BOT_COLOR, borderWidth: 1, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8, marginBottom: 6 },
  quickReplyText: { color: BOT_COLOR, fontWeight: 'bold' }
});

export default ChatScreen; 