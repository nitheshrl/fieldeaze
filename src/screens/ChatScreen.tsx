import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Linking, Alert, Image, SafeAreaView } from 'react-native';
import mockDataRaw from '../mockData.json';

const mockData: any = mockDataRaw;

const BOT_COLOR = '#0e376e';
const SUPPORT_PHONE = '+919677782813';
const BOT_NAME = 'Fieldot';
const BOT_AVATAR = 'https://img.icons8.com/fluency/48/robot-2.png'; // You can use your own bot icon

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
  context?: {
    awaitingServiceNumber?: boolean;
    awaitingCategoryNumber?: { serviceId: string };
    multiCategory?: boolean;
    lastSelected?: any;
  };
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Hi! I'm your ${BOT_NAME} assistant. How can I help you today?\nYou can ask about services, offers, or type 'help' for options.`, sender: 'bot', quickReplies: ["Show services", "Show offers", "FAQs"] }
  ]);
  const [input, setInput] = useState('');
  const [activeQuick, setActiveQuick] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);
  // Use a ref to accumulate selected categories during multi-select
  const multiSelectAccumulator = useRef<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [bookingStep, setBookingStep] = useState<'none' | 'name' | 'mobile' | 'address' | 'done'>('none');
  const [bookingInfo, setBookingInfo] = useState<{ name: string; mobile: string; address: string }>({ name: '', mobile: '', address: '' });

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Main bot logic: generate a reply based on user input
  const getBotReply = (userMsg: string, context?: { awaitingServiceNumber?: boolean, awaitingCategoryNumber?: { serviceId: string }, multiCategory?: boolean, lastSelected?: any }) => {
    const text = userMsg.toLowerCase();
    // 1. Greetings
    if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) {
      return { text: "Hello! How can I assist you today?", quickReplies: ["Show services", "Show offers", "FAQs", "Call Support"] };
    }
    // 2. Show all services (numbered)
    if (text.includes('service')) {
      const servicesArr = mockData.servicesList || mockData.services;
      const names = servicesArr.map((s: any, idx: number) => `${idx + 1}. ${s.name || s.title}`).join('\n');
      return {
        text: `Here are our top services:\n${names}\n\nPlease reply with the number of the service you need.`,
        quickReplies: []
      };
    }
    // 2b. If awaiting service number selection
    if (context && context.awaitingServiceNumber) {
      const servicesArr = mockData.servicesList || mockData.services;
      const num = parseInt(userMsg.trim());
      if (!isNaN(num) && num >= 1 && num <= servicesArr.length) {
        const service = servicesArr[num - 1];
        if (service && mockData.serviceDetails[service.id]) {
          const details = mockData.serviceDetails[service.id];
          // If there are categories, ask to select one or more
          if (details.categories && details.categories.length) {
            const catList = details.categories.map((cat: any, idx: number) => `${idx + 1}. ${cat.name} (${cat.price})`).join('\n');
            return {
              text: `Please select a specific service (you can reply with multiple numbers separated by commas, e.g. 1,3,5):\n${catList}\n\nReply with the number(s) of the service(s) you want.`,
              quickReplies: [],
              context: { awaitingCategoryNumber: { serviceId: service.id }, multiCategory: true }
            };
          }
          // If no categories, go to address selection
          let reply = `${details.name}: ${details.description}\n`;
          if (details.superSaverPacks && details.superSaverPacks.length) {
            reply += `\n\nPopular packs:\n`;
            reply += details.superSaverPacks.map((p: any) => `- ${p.name} (${p.price})`).join('\n');
          }
          if (details.faqs && details.faqs.length) {
            reply += `\n\nExample FAQ: ${details.faqs[0].question} - ${details.faqs[0].answer}`;
          }
          reply += `\n\nPlease choose an address for your booking or use your live location:`;
          const addresses = (mockData.user && mockData.user.addresses) ? mockData.user.addresses.map((a: any) => `${a.label}: ${a.address}`) : [];
          return {
            text: reply,
            quickReplies: [...addresses, "Use live location"]
          };
        }
      }
      return { text: "Invalid service number. Please reply with a valid number from the list." };
    }
    // 2c. If awaiting category (sub-service) number selection (multi-select)
    if (context && context.awaitingCategoryNumber && context.multiCategory) {
      const { serviceId } = context.awaitingCategoryNumber;
      const details = mockData.serviceDetails[serviceId];
      if (details && details.categories && details.categories.length) {
        // Parse numbers from user input
        const nums = userMsg.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= details.categories.length);
        if (nums.length > 0) {
          const selected = nums.map(n => details.categories[n - 1]);
          // Save selected categories to state (handled in sendMessage)
          let reply = `You selected:\n` + selected.map(cat => `- ${cat.name} (${cat.price})`).join('\n');
          reply += `\n\nWould you like to add more services from this list? Reply with more numbers, or type 'done' to proceed to address selection.`;
          return {
            text: reply,
            quickReplies: ["done"],
            context: { awaitingCategoryNumber: { serviceId }, multiCategory: true, lastSelected: selected }
          };
        }
        if (text === 'done') {
          // Show summary and ask for address
          let reply = `You have selected the following services:\n` + (selectedCategories.length ? selectedCategories.map((cat: any) => `- ${cat.name} (${cat.price})`).join('\n') : 'None');
          reply += `\n\nPlease choose an address for your booking or use your live location:`;
          const addresses = (mockData.user && mockData.user.addresses) ? mockData.user.addresses.map((a: any) => `${a.label}: ${a.address}`) : [];
          return {
            text: reply,
            quickReplies: [...addresses, "Use live location"]
          };
        }
        return { text: "Invalid selection. Please reply with valid number(s) from the list, or type 'done' to proceed." };
      }
    }
    // 3. Show offers
    if (text.includes('offer') || text.includes('discount')) {
      if (mockData.offers && mockData.offers.length > 0) {
        const offersText = mockData.offers.map((o: any) => `${o.title}: ${o.description} (Code: ${o.code})`).join('\n- ');
        return { text: `Current offers:\n- ${offersText}` };
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
    const servicesArr = mockData.servicesList || mockData.services;
    const service = servicesArr.find((s: any) => {
      const serviceName = (s.name || s.title).toLowerCase();
      return text.includes(serviceName) || serviceName.includes(text);
    });
    if (service && mockData.serviceDetails[service.id]) {
      const details = mockData.serviceDetails[service.id];
      let reply = `${details.name}: ${details.description}\n`;
      // Show all related categories (sub-services)
      if (details.categories && details.categories.length) {
        reply += `\nAvailable services:\n`;
        reply += details.categories.map((cat: any) => `- ${cat.name} (${cat.price})`).join('\n');
      }
      // Show all packages
      if (details.superSaverPacks && details.superSaverPacks.length) {
        reply += `\n\nPopular packs:\n`;
        reply += details.superSaverPacks.map((p: any) => `- ${p.name} (${p.price})`).join('\n');
      }
      // Example FAQ
      if (details.faqs && details.faqs.length) {
        reply += `\n\nExample FAQ: ${details.faqs[0].question} - ${details.faqs[0].answer}`;
      }
      return { text: reply, quickReplies: ["Book now", "Show more", "FAQs"] };
    }
    // 6. Book/Reschedule/Cancel
    if (/\b(book now)\b/.test(text)) {
      // Show address options from mockData
      const addresses = (mockData.user && mockData.user.addresses) ? mockData.user.addresses.map((a: any) => `${a.label}: ${a.address}`) : [];
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

    // 1. Booking info collection takes absolute priority
    if (bookingStep !== 'none') {
      if (bookingStep === 'name') {
        setBookingInfo(prev => ({ ...prev, name: msgText }));
        setMessages(prev => [...prev, { id: Date.now(), text: 'Please enter your mobile number:', sender: 'bot' }]);
        setBookingStep('mobile');
        return;
      }
      if (bookingStep === 'mobile') {
        setBookingInfo(prev => ({ ...prev, mobile: msgText }));
        setMessages(prev => [...prev, { id: Date.now(), text: 'Please enter your address:', sender: 'bot' }]);
        setBookingStep('address');
        return;
      }
      if (bookingStep === 'address') {
        setBookingInfo(prev => ({ ...prev, address: msgText }));
        setMessages(prev => [...prev, { id: Date.now(), text: `Your service has been booked!\nName: ${bookingInfo.name}\nMobile: ${bookingInfo.mobile}\nAddress: ${msgText}`, sender: 'bot' }]);
        setBookingStep('none');
        setSelectedCategories([]);
        return;
      }
    }

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
    setActiveQuick('');
    const lastBotMsg = messages[messages.length - 1];

    // If last bot message was the numbered category (sub-service) list, expect a number or 'done'
    if (
      lastBotMsg &&
      lastBotMsg.sender === 'bot' &&
      lastBotMsg.text.includes('Please select a specific service') &&
      lastBotMsg.context &&
      typeof lastBotMsg.context === 'object' && lastBotMsg.context !== null &&
      'awaitingCategoryNumber' in lastBotMsg.context &&
      lastBotMsg.context.multiCategory
    ) {
      const ctx = lastBotMsg.context;
      if (msgText.trim().toLowerCase() === 'done') {
        setSelectedCategories(multiSelectAccumulator.current);
        setTimeout(() => {
          const cats = multiSelectAccumulator.current;
          let reply = `You have selected the following services:\n` + (cats.length ? cats.map((cat: any) => `- ${cat.name} (${cat.price})`).join('\n') : 'None');
          reply += `\n\nPlease enter your name for the booking:`;
          setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
          setBookingStep('name');
          setBookingInfo({ name: '', mobile: '', address: '' });
          multiSelectAccumulator.current = [];
        }, 600);
        return;
      }
      // Otherwise, add selected categories to the accumulator
      if (ctx.awaitingCategoryNumber) {
        const details = mockData.serviceDetails[ctx.awaitingCategoryNumber.serviceId];
        const nums = msgText.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= details.categories.length);
        if (nums.length > 0) {
          const selected = nums.map(n => details.categories[n - 1]);
          multiSelectAccumulator.current = [...multiSelectAccumulator.current, ...selected];
          setTimeout(() => {
            const botReply = getBotReply(msgText, { awaitingCategoryNumber: ctx.awaitingCategoryNumber, multiCategory: ctx.multiCategory });
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply.text, sender: 'bot', quickReplies: botReply.quickReplies, context: botReply.context }]);
          }, 600);
          return;
        }
      }
    }

    // If last bot message was the numbered service list, expect a number
    if (
      lastBotMsg &&
      lastBotMsg.sender === 'bot' &&
      lastBotMsg.text.includes('Please reply with the number of the service you need.')
    ) {
      setTimeout(() => {
        const botReply = getBotReply(msgText, { awaitingServiceNumber: true });
        // If botReply.context, pass it to next getBotReply
        if (botReply.context) {
          setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply.text, sender: 'bot', quickReplies: botReply.quickReplies, context: botReply.context }]);
        } else {
          setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply.text, sender: 'bot', quickReplies: botReply.quickReplies }]);
        }
      }, 600);
      return;
    }

    // Address selection (legacy, not used in new flow)
    if (
      lastBotMsg &&
      lastBotMsg.sender === 'bot' &&
      lastBotMsg.text.includes('Please choose an address for your booking')
    ) {
      // Accept either the full quick reply or just the label
      const addresses = (mockData.user && mockData.user.addresses) ? mockData.user.addresses : [];
      const isFullMatch = (lastBotMsg.quickReplies || []).includes(msgText);
      const isLabelMatch = addresses.some((a: any) => a.label.toLowerCase() === msgText.trim().toLowerCase());
      if (isFullMatch || isLabelMatch) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, text: 'Your service has been booked!', sender: 'bot' }
          ]);
          setSelectedCategories([]); // Reset after booking
          multiSelectAccumulator.current = [];
        }, 600);
        return;
      }
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
      styles.bubbleWrap,
      item.sender === 'bot' ? styles.botBubbleWrap : styles.userBubbleWrap
    ]}>
      {item.sender === 'bot' && (
        <Image source={{ uri: BOT_AVATAR }} style={styles.botAvatar} />
      )}
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
              <TouchableOpacity
                key={idx}
                style={[
                  styles.quickReplyBtn,
                  activeQuick === qr && styles.quickReplyBtnActive
                ]}
                onPress={() => {
                  setActiveQuick(qr);
                  sendMessage(qr);
                }}
              >
                <Text style={[
                  styles.quickReplyText,
                  activeQuick === qr && styles.quickReplyTextActive
                ]}>{qr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.bg}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: BOT_AVATAR }} style={styles.headerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{BOT_NAME}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>
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
          placeholder="Send a message..."
          onSubmitEditing={() => sendMessage(input)}
          placeholderTextColor="#b0b0b0"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f4f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, paddingTop: 16, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2, marginBottom: 2 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 12, backgroundColor: '#eaf4ff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: BOT_COLOR },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27ae60', marginRight: 6 },
  onlineText: { fontSize: 13, color: '#27ae60', fontWeight: '600' },
  chatContainer: { padding: 16, paddingBottom: 80 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
  botBubbleWrap: { alignSelf: 'flex-start' },
  userBubbleWrap: { alignSelf: 'flex-end' },
  botAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: '#eaf4ff' },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 18 },
  botBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderTopLeftRadius: 4, borderTopRightRadius: 18, borderBottomRightRadius: 18, borderWidth: 1, borderColor: '#eaf4ff' },
  userBubble: { backgroundColor: BOT_COLOR, borderBottomRightRadius: 4, borderTopRightRadius: 4, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  bubbleText: { fontSize: 16 },
  botText: { color: '#222' },
  userText: { color: '#fff' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, fontSize: 16, marginRight: 8 },
  sendBtn: { backgroundColor: BOT_COLOR, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
  quickReplies: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  quickReplyBtn: { backgroundColor: '#fff', borderColor: BOT_COLOR, borderWidth: 1.5, borderRadius: 18, paddingVertical: 7, paddingHorizontal: 18, marginRight: 8, marginBottom: 8 },
  quickReplyBtnActive: { backgroundColor: BOT_COLOR },
  quickReplyText: { color: BOT_COLOR, fontWeight: 'bold', fontSize: 15 },
  quickReplyTextActive: { color: '#fff' },
});

export default ChatScreen; 