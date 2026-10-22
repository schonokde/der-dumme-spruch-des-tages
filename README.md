# Der dumme Spruch des Tages

Ein einfacher, plattformübergreifender Expo-/React-Native-Prototyp für Android und iOS. Die Oberfläche ist deutsch und funktioniert offline.

## Funktionen
- Spruchansicht und Zufall/Nächster Spruch
- Filter nach den neun gewünschten Autoren
- Merkliste/Favoriten
- Teilen über das native Teilen-Menü
- Kennzeichnung: eigener Spruch, sinngemäße Übertragung, Quelle noch zu prüfen oder verifiziertes Zitat

## Lokal starten
Voraussetzungen: Node.js (LTS) und Expo Go auf dem Smartphone.

1. Entpacke das Projekt.
2. Öffne ein Terminal im Projektordner.
3. Installiere Abhängigkeiten:
   ```bash
   npm install
   ```
4. Starte Expo:
   ```bash
   npx expo start
   ```
5. Scanne den QR-Code mit Expo Go (Android) oder der iOS-Kamera/Expo Go, sofern verfügbar.

Für Android-Emulator: `npm run android`. Für iOS-Simulator benötigst du macOS und Xcode: `npm run ios`.

## Hinweis zu Zitaten und Rechten
Die Starter-Sammlung ist absichtlich klein. Die meisten Einträge sind als eigene Sprüche gekennzeichnet und werden keinem der genannten Autoren zugeschrieben. Einige bekannte Zuschreibungen sind ausdrücklich **nicht verifiziert**. Die App markiert sie nicht als verifiziert. Vor einer öffentlichen Veröffentlichung sollten für jedes Zitat eine belastbare Quelle, die genaue deutsche Fassung und die Nutzungsrechte geprüft werden. Sinngemäße Übertragungen werden separat gekennzeichnet.

## Vor einer Veröffentlichung
- `de.example.dummerspruch` in `app.json` durch eine eigene, eindeutige Paket-/Bundle-ID ersetzen.
- App-Icon und Splashscreen ergänzen.
- Zitate und Rechte prüfen.
- Mit EAS Build können native Testbuilds erzeugt werden: https://docs.expo.dev/build/introduction/
