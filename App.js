import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, ScrollView, Share, StatusBar, StyleSheet } from 'react-native';

const AUTHORS = [
  'Douglas Adams', 'John Cleese', 'Terry Pratchett', 'Groucho Marx',
  'Steve Martin', 'Woody Allen', 'Mark Twain', 'Torsten Sträter', 'Dieter Hildebrandt'
];

// Starter content is deliberately labelled honestly. Original app jokes are not attributed
// to the requested authors. Add quotations only after checking source and usage rights.
const QUOTES = [
  { id: 'o1', text: 'Ich bin nicht unorganisiert. Meine Dinge führen nur ein sehr freies Leben.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o2', text: 'Mein innerer Schweinehund hat heute Homeoffice beantragt.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o3', text: 'Ich habe einen Plan. Er ist noch nicht informiert, dass er funktionieren soll.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o4', text: 'Manche nennen es Chaos. Ich nenne es eine überraschungsbasierte Ablage.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o5', text: 'Die gute Nachricht: Es könnte schlimmer sein. Die schlechte: Das weiß es auch.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o6', text: 'Ich bin multitaskingfähig: Ich kann gleichzeitig prokrastinieren und mir Sorgen machen.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o7', text: 'Erfahrung ist, wenn man den Fehler erkennt, während man ihn wiederholt.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o8', text: 'Ich wollte die Welt verändern. Dann habe ich die Nutzungsbedingungen gelesen.', author: 'Eigener Spruch', status: 'original' },
  { id: 'o9', text: 'Der frühe Vogel fängt den Wurm. Die zweite Maus bekommt den Käse.', author: 'Mark Twain', status: 'needs_check', note: 'Bekannte Zuschreibung, Primärquelle vor Veröffentlichung prüfen.' },
  { id: 'o10', text: 'Ich weigere mich, einem Club beizutreten, der mich als Mitglied aufnehmen würde.', author: 'Groucho Marx', status: 'needs_check', note: 'Deutsche Übertragung eines bekannten Spruchs; Wortlaut und Quelle vor Veröffentlichung prüfen.' },
  { id: 'o11', text: 'Die Antwort auf die große Frage nach dem Leben, dem Universum und allem lautet 42.', author: 'Douglas Adams', status: 'adaptation', note: 'Sinngemäße Kurzfassung eines Motivs aus „Per Anhalter durch die Galaxis“; Rechte und Wortlaut prüfen.' },
  { id: 'o12', text: 'Die Realität ist oft nur eine schlecht organisierte Form des Absurden.', author: 'Eigener Spruch', status: 'original' },
];

const STATUS = {
  original: { label: 'Eigener Spruch', color: '#2E8B69', symbol: '✦' },
  verified: { label: 'Verifiziertes Zitat', color: '#2E8B69', symbol: '✓' },
  adaptation: { label: 'Sinngemäße Übertragung', color: '#A66B00', symbol: '≈' },
  needs_check: { label: 'Quelle noch zu prüfen', color: '#A66B00', symbol: '!' },
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [author, setAuthor] = useState('Alle Autoren');
  const [screen, setScreen] = useState('today');

  const available = useMemo(() => {
    let list = QUOTES;
    if (author !== 'Alle Autoren') list = list.filter(q => q.author === author);
    if (screen === 'favorites') list = list.filter(q => favorites.includes(q.id));
    return list;
  }, [author, screen, favorites]);

  const quote = available.length ? available[current % available.length] : null;

  function nextQuote() {
    const list = screen === 'favorites' ? QUOTES.filter(q => favorites.includes(q.id)) :
      (author === 'Alle Autoren' ? QUOTES : QUOTES.filter(q => q.author === author));
    if (list.length) setCurrent(n => (n + 1) % list.length);
  }
  function toggleFavorite(q) {
    setFavorites(old => old.includes(q.id) ? old.filter(id => id !== q.id) : [...old, q.id]);
  }
  async function shareQuote(q) {
    try { await Share.share({ message: `„${q.text}“\\n— ${q.author}\\n(${STATUS[q.status]?.label || 'Status offen'})\\n\\nDer dumme Spruch des Tages` }); } catch (_) {}
  }

  const displayed = screen === 'authors' ? null : quote;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DEINE TÄGLICHE DOSIS UNSINN</Text>
        <Text style={styles.brand}>Der dumme Spruch{'\n'}des Tages</Text>
        <Text style={styles.subtitle}>Kleine Sprüche. Große Wirkung.</Text>
      </View>

      <View style={styles.nav}>
        {[
          ['today', 'Heute'], ['authors', 'Autoren'], ['favorites', `Merkliste (${favorites.length})`]
        ].map(([id, label]) => (
          <Pressable key={id} onPress={() => { setScreen(id); setCurrent(0); }} style={[styles.navItem, screen === id && styles.navActive]}>
            <Text style={[styles.navText, screen === id && styles.navTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {screen === 'authors' ? (
        <ScrollView contentContainerStyle={styles.authorList}>
          <Text style={styles.sectionTitle}>Deine neun Autoren</Text>
          <Text style={styles.helper}>Wähle einen Namen, um vorhandene Einträge zu sehen. Neue Zitate werden erst nach Quellenprüfung als verifiziert markiert.</Text>
          {AUTHORS.map(name => (
            <Pressable key={name} style={styles.authorRow} onPress={() => { setAuthor(name); setScreen('today'); setCurrent(0); }}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{name.split(' ').map(x => x[0]).join('').slice(0,2)}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.authorName}>{name}</Text>
                <Text style={styles.authorMeta}>{QUOTES.filter(q => q.author === name).length} Einträge · Quellenprüfung beachten</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
          <Pressable onPress={() => { setAuthor('Alle Autoren'); setScreen('today'); }} style={styles.secondaryButton}><Text style={styles.secondaryText}>Alle Sprüche anzeigen</Text></Pressable>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {screen === 'today' && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>AUTOR</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Alle Autoren', ...AUTHORS].map(name => (
                  <Pressable key={name} onPress={() => { setAuthor(name); setCurrent(0); }} style={[styles.chip, author === name && styles.chipActive]}>
                    <Text style={[styles.chipText, author === name && styles.chipTextActive]}>{name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
          {screen === 'favorites' && <Text style={styles.sectionTitle}>Deine Merkliste</Text>}
          {displayed ? (
            <View style={styles.quoteCard}>
              <Text style={styles.date}>{screen === 'today' ? 'DER SPRUCH FÜR HEUTE' : 'DEIN GESPEICHERTER SPRUCH'}</Text>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteText}>{displayed.text}</Text>
              <Text style={styles.quoteAuthor}>— {displayed.author}</Text>
              <View style={[styles.statusPill, { borderColor: STATUS[displayed.status].color }]}>
                <Text style={[styles.statusText, { color: STATUS[displayed.status].color }]}>{STATUS[displayed.status].symbol}  {STATUS[displayed.status].label}</Text>
              </View>
              {displayed.note ? <Text style={styles.note}>{displayed.note}</Text> : null}
              <View style={styles.actions}>
                <Pressable style={styles.action} onPress={() => toggleFavorite(displayed)}>
                  <Text style={styles.actionIcon}>{favorites.includes(displayed.id) ? '♥' : '♡'}</Text>
                  <Text style={styles.actionText}>{favorites.includes(displayed.id) ? 'Gemerkt' : 'Merken'}</Text>
                </Pressable>
                <Pressable style={styles.action} onPress={() => shareQuote(displayed)}>
                  <Text style={styles.actionIcon}>↗</Text><Text style={styles.actionText}>Teilen</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>♡</Text>
              <Text style={styles.emptyTitle}>Hier ist noch Platz für Unsinn.</Text>
              <Text style={styles.helper}>{screen === 'favorites' ? 'Speichere einen Spruch über „Merken“, dann findest du ihn hier wieder.' : 'Für diesen Autor gibt es noch keinen Eintrag. Du kannst später geprüfte Zitate ergänzen.'}</Text>
            </View>
          )}
          {screen === 'today' && (
            <>
              <Pressable style={styles.primaryButton} onPress={nextQuote}><Text style={styles.primaryButtonText}>⤨   Nächster Spruch</Text></Pressable>
              <Text style={styles.disclaimer}>Hinweis: „Quelle noch zu prüfen“ bedeutet, dass die Zuschreibung nicht als verifiziert gilt. Nur Einträge mit „Verifiziertes Zitat“ sollten nach Belegprüfung so gekennzeichnet werden.</Text>
            </>
          )}
        </ScrollView>
      )}
      <View style={styles.footer}><Text style={styles.footerText}>OFFLINE · DEUTSCH · HUMOR MIT QUELLENBEWUSSTSEIN</Text></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#101E22' },
  header: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 20 },
  eyebrow: { color: '#F4BE56', fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  brand: { color: '#F7F1E4', fontSize: 29, fontWeight: '800', marginTop: 8, lineHeight: 33 },
  subtitle: { color: '#C7D0CC', marginTop: 7, fontSize: 13 },
  nav: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#1B2C30', borderRadius: 12, padding: 4, marginBottom: 8 },
  navItem: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 9 },
  navActive: { backgroundColor: '#F4BE56' },
  navText: { color: '#CFD8D4', fontSize: 12, fontWeight: '600' },
  navTextActive: { color: '#172328' },
  content: { padding: 18, paddingBottom: 24, flexGrow: 1 },
  filterRow: { marginBottom: 15 },
  filterLabel: { color: '#C2CDC8', fontSize: 10, letterSpacing: 1.4, fontWeight: '800', marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#415256', marginRight: 7 },
  chipActive: { backgroundColor: '#F4BE56', borderColor: '#F4BE56' },
  chipText: { color: '#E5EAE5', fontSize: 12 },
  chipTextActive: { color: '#172328', fontWeight: '700' },
  quoteCard: { backgroundColor: '#F5F0E4', borderRadius: 20, padding: 22, marginTop: 4 },
  date: { color: '#72786E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  quoteMark: { color: '#E6B348', fontSize: 58, lineHeight: 58, marginTop: 6, height: 48 },
  quoteText: { color: '#202C2C', fontSize: 24, fontWeight: '700', lineHeight: 32 },
  quoteAuthor: { color: '#445451', fontSize: 14, fontWeight: '600', marginTop: 17 },
  statusPill: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 6, marginTop: 14 },
  statusText: { fontSize: 11, fontWeight: '700' },
  note: { color: '#6C6D61', fontSize: 11, lineHeight: 16, marginTop: 10 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#DDD7C9', marginTop: 20, paddingTop: 13, justifyContent: 'space-around' },
  action: { alignItems: 'center', minWidth: 80 },
  actionIcon: { color: '#253A3A', fontSize: 25 },
  actionText: { color: '#394743', fontSize: 11, marginTop: 3 },
  primaryButton: { backgroundColor: '#F4BE56', borderRadius: 15, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#172328', fontSize: 15, fontWeight: '800' },
  disclaimer: { color: '#AAB8B4', fontSize: 11, lineHeight: 16, marginTop: 15, textAlign: 'center' },
  sectionTitle: { color: '#F5F0E4', fontSize: 20, fontWeight: '800', marginBottom: 9 },
  helper: { color: '#AAB8B4', fontSize: 12, lineHeight: 18, marginBottom: 14 },
  authorList: { padding: 18, paddingBottom: 28 },
  authorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2C3C40' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#263B3E', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#516263' },
  avatarText: { color: '#F4BE56', fontWeight: '800', fontSize: 12 },
  authorName: { color: '#F5F0E4', fontSize: 14, fontWeight: '700' },
  authorMeta: { color: '#AAB8B4', fontSize: 10, marginTop: 4 },
  chevron: { color: '#F4BE56', fontSize: 26, paddingHorizontal: 8 },
  secondaryButton: { borderWidth: 1, borderColor: '#657578', padding: 13, alignItems: 'center', borderRadius: 12, marginTop: 20 },
  secondaryText: { color: '#F5F0E4', fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 16 },
  emptyIcon: { color: '#F4BE56', fontSize: 50 },
  emptyTitle: { color: '#F5F0E4', fontSize: 18, fontWeight: '800', marginVertical: 10, textAlign: 'center' },
  footer: { paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#293A3D' },
  footerText: { color: '#80918D', fontSize: 8, letterSpacing: 1.2 },
});
