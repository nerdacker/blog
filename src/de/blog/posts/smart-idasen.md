---
title: Ein Upgrade für meinen Schreibtisch
description: Spätestens seit Homeoffice zur Regel geworden ist, erfreuen sich höhenverstellbare Schreibtische auch Zuhause wachsender Beliebtheit. Höchste Zeit sie in die Welt des Smarthomes einzuführen
date: 2022-01-11
author: Alessio Bisgen
image: /static/img/posts/smart-idasen/title.jpg
tags:
  - technology
  - smarthome
---

In meinem heimischen Büro ist das rückenfreundliche Möbelstück nicht mehr wegzudenken und es wandert am Tag etliche Male zwischen den Positionen hin und her. Bei meinem Modell ist dazu allerdings etwas Geduld notwendig, da ich die Taste zum Verstellen gedrückt halten muss. Definitely hackable!

Ich habe meinen Schreibtisch vor einem Jahr mit dem [Idåsen](https://www.ikea.com/de/de/p/idasen-gest-f-tisch-sitz-steh-el-dunkelgrau-00320723/) Gestell von Ikea aufgerüstet, um ein wenig Abwechlung in die langen Stunden vor dem Monitor zu bringen. Das Gestell besitzt einen einfachen Wippschalter zur Änderung der Höhe in eine bestimmte Richtung und ist mit Bluetooth ausgestattet, um den Schreibtisch über eine App steuerbar zu machen. Die Anwendung wird vom dänischen Hersteller *Linak* angeboten, mit dem Ikea für diesen Schreibtisch kooperiert. Die App erlaubt das Koppeln mit unterstützten Schreibtischen, das Fernsteuern des Tisches und das Festlegen von bis zu drei Höhenpositionen in cm, die in der Schreibtischsteuerung gespeichert werden. Ebenso ist es über die App möglich, den Nutzer in festgelegten Zeitintervallen ans Aufstehen zu erinnern, um bestimmte Ziele zu erreichen. Beispielsweise könnte man das Ziel einstellen "ich möchte während der Arbeit jede Stunde 5 Minuten stehen". Dabei fährt der Tisch nicht automatisch hoch, stattdessen bleibt es bei einer Pushnachricht und einer manuellen Aktion. Dies gilt übrigens auch für die gesamte Bedienung der App. Dort kann man zwar Höhen einstellen, muss jedoch den Button so lange gedrückt halten, bis der Schreibtisch die Sollhöhe erreicht hat. Das hat vermutlich Sicherheitsgründe, die aber durch die automatische Stoppfunktion des Tisches bei Blockade nicht ganz nachvollziehbar sind.

## Das Ziel

Um auf das lange manuelle Gedrückhalten von Knöpfen zu verzichten und eine Schnittstelle fürs Smarthome zur Verfügung zu stellen, wollen wir eine Möglichkeit schaffen, wie der Tisch minimalinvasiv gesteuert werden kann. Dazu bietet sich die Nutzung der BLE-Schnittstelle an (*Bluetooth Low Energy*), über die auch die App mit dem Tisch kommuniziert. So muss nichts gelötet werden und wir greifen nicht in die Elektronik des Tisches ein.

Folgende Bedingungen wollen wir erreichen:

- Tisch kann in OpenHAB als Item integriert werden
- Tisch kann mit dem Google Assistant in die Position "Stehen" und "Sitzen" gefahren werden
- Tisch funktioniert weiterhin mit der manuellen Wippe
- Es können Regeln eingestellt werden, mit denen der Tisch in bestimmten Situationen in eine Position fährt

## Voraussetzungen

- Raspberry Pi 3B+ oder höher mit Openhabian / Raspbian und Python 3
- OpenHAB ist auf dem Raspi installiert
- Ikea Idåsen (höhenverstellbar) mit Bluetooth-Unterstützung
- Der Tisch sollte sich in Bluetooth-Reichweite zum Pi befinden (max 10m)

## 1. MAC-Adresse des Schreibtischs ermitteln

Zunächst wollen wir herausfinden, welche MAC-Adresse der Schreibtisch besitzt. Dies mache ich mir der Android-App [BLE-Scanner](https://play.google.com/store/apps/details?id=com.macdom.ble.blescanner&hl=de&gl=US).
![BLE-Scanner](/static/img/posts/smart-idasen/01.jpg)
Die App listet alle BLE-Geräte in der Umgebung auf, zusammen mit ihrer MAC-Adresse. Letztere merken wir uns für später.

## 2. Pi mit dem Schreibtisch koppeln

Nun müssen wir eine permanente Bluetooth-Verbindung mit dem Schreibtisch herstellen. Dies tun wir mit dem Tool [bluetoothctl](https://kofler.info/bluetooth-konfiguration-im-terminal-mit-bluetoothctl/), welches einen interaktiven Weg bereitstellt, Bluetooth-Geräte zu verwalten. Folgende Befehle werden benötigt:

```bash
bluetoothctl  # den Bluetooth-Agenten starten
agent on  # den Agenten registrieren, um automatisches Pairing zu ermöglichen
scan on  # nach Geräten suchen, sicherstellen dass unser Tisch sichtbar ist
scan off  # die Suche stoppen
pair AA:AA:AA:AA:AA:AA  # den Tisch pairen (mit der ermittelten MAC)
trust AA:AA:AA:AA:AA:AA  # das Gerät als vertrauenswürdig markieren
connect AA:AA:AA:AA:AA:AA  # Verbindung herstellen
exit  # Agenten verlassen
```

An dieser Stelle ist der Tisch gekoppelt und sollte nun automatisch verbunden werden, sofern er in Reichweite ist. Das können wir verifizieren, indem wir den Pi einmal neu starten und dann mit `bluetoothctl info AA:AA:AA:AA:AA:AA` prüfen, ob unser Schreibtisch noch gekoppelt ist. Dabei muss der Tisch nicht unbedingt als *connected* gekennzeichnet sein, da die Verbindung erst kurzfristig vor dem Datenaustausch mit dem Schreibtisch hergestellt wird.

## 3. Raspberry-Pi vorbereiten - Desk-Controller installieren

Zur Steuerung des Controllers nutzen wir einen Fork des in Python geschriebenen Projekts *Idasen-Controller*, welcher in folgendem Git-Repo zu finden ist und das Tool um ein bequemes CLI erweitert: [GitHub newAM/idasen](https://github.com/newAM/idasen).

Da das Projekt bereits in den Python-Paketquellen registriert wurde können wir es bequem via pip installieren:

```bash
python3 -m pip install --upgrade idasen
```

Nun wollen wir ein Konfigurations-File erstellen, in dem wir die Standardwerte für die Positionen, sowie die zuvor ermittelte MAC-Adresse des Schreibtisches eintragen. 
Da wir vor haben, das CLI von Openhab-aus aufzurufen, müssen wir die Konfiguration im Homeverzeichnis des Users *opehab* anlegen. Dieses liegt in der Standardinstallation mit Openhabian unter `var/lib/openhab`. Ganz einfach können wir die Konfiguration für diesen User initialisieren, indem wir als sudo folgenden Befehl ausführen: `sudo -u openhab idasen init`
Nun sollte die Standardkonfiguration unter `/var/lib/openhab/.config/idasen/idasen.yaml` zu finden sein und kann dort entsprechend angepasst werden.

```yaml
mac_address: AA:AA:AA:AA:AA:AA
positions:
    sit: 0.81
    stand: 1.194
```

die Höhenangaben erfolgen übrigens in Metern. Zum Testen können folgende Befehle benutzt werden:

```bash
idasen height  # aktuelle Höhe ausgeben
idasen sit  # in Sitzposition fahren
idasen stand  # in Stehposition fahren
```

Und, bewegt sich der Schreibtisch?

## 4. Openhab-Konfiguration anpassen

Zu guter letzt binden wir den Schreibtisch in Openhab ein. Dazu verwenden wir das [Exec Binding](https://www.openhab.org/addons/bindings/exec/), mit dem via Openhab Shell-Kommandos ausgeführt werden können.

### .things

Wir erstellen nun für jeden Idasen-Befehl ein Thing und hinterlegen den passenden Befehl:

```scala
Thing exec:command:idasenstand [command="idasen stand", interval=0, autorun=false]
Thing exec:command:idasensit [command="idasen sit", interval=0, autorun=false]
Thing exec:command:idasenheight [command="idasen height", interval=60, autorun=false]
```

interval=0 sorgt dafür, dass der Befehl nicht automatisch wiederholt ausgeführt wird. Mit dem exec-Binding ist es notwendig, für jeden Shell-Befehl ein separates Thing zu erstellen.

Damit die Befehle ausgeführt werden dürfen, müssen wir sie noch whitelisten. Dazu erstellen wir in der OpenHAB-Konfiguration eine Datei unter `misc/exec.whitelist` und fügen die Befehle hinzu:

```bash
# exec.whitelist
idasen sit
idasen stand
idasen height
```

Es folgen die restlichen OpenHAB Konfigurationsdateien

### .items

Hier erstellen wir drei Items, die an die drei erstellten Things binden. Zum Steuern der Geräte über einen Google-Assistant Sprachbefehl verwende ich die [Google Assistant Action](https://www.openhab.org/docs/ecosystem/google-assistant/). Hierbei wird über das Attribut ```ga="Switch"``` festgelegt, dass diese Items in Google Assistant als Schalter erkannt werden sollen. Es spielt dabei keine Rolle, ob die Schalter den Zustand ON, oder OFF besitzen, da der Thing Channel bei jedem Zustandswechsel getriggert wird. Die neuen Schalter werden nun an Google Home mit dem jeweiligen Namen des Items übergeben.

Weiterhin wird beim Item *idasenHeight* über eine [Regex Transformation](https://www.openhab.org/addons/transformations/regex/) der vom idasen-cli übermittelte Höhenwert in eine korrekte Meterangabe geparst. Dies ist notwendig, da der Höhenwert vom Exec-Binding als String mit der kompletten Ausgabe des Befehls zurückgegeben wird, z.B. als ```1.199 meters```

```scala
Switch idasenStand "Schreibtisch Stehen" {channel="exec:command:idasenstand:run", ga="Switch"}
Switch idasenSit "Schreibtisch Sitzen" {channel="exec:command:idasensit:run", ga="Switch"}
String idasenHeight {channel="exec:command:idasenheight:output" [profile="transform:REGEX", function="^(\\S*)[\\s]+.*", sourceFormat="%s"]}
```

### .sitemap

Nun passen wir noch die Sitemap an, um auch Schalter für unsere Aktionen zu erhalten. Dazu erstellen wir folgende Elemente in einer Sitemap:

```scala
Switch item=idasenStand label="Schreibtisch stehen" mappings=[ON="Hoch"]
Switch item=idasenSit label="Schreibtisch sitzen" mappings=[ON="Runter"]
Text item=idasenHeight label="Höhe [%s m]"
```

![Sitemap](/static/img/posts/smart-idasen/02.jpg)

## Ablauf im Assistant einrichten

Zu guter Letzt wollen wir die Sprachsteuerung noch etwas geschmeidiger gestalten, indem wir Abläufe zur Steuerung des Tisches einrichten. Erst einmal müssen wir aber dem Assistant mitteilen, dass sich die Openhab-Geräte geändert haben und er doch bitte neue hinzufügen möge. Dies geschieht mit dem Befehl "*Hey Google, aktualisiere die Geräte*".
Nun werden die Items *Schreibtisch Sitzen* und *Schreibtisch Stehen* hinzugefügt.

Im nächsten Schritt richten wir den Ablauf ein:
![Sitemap](/static/img/posts/smart-idasen/03.jpg)
Ein Klick auf *Intelligente Geräte steuern* öffnet die Möglichkeit, das Gerät *Schreibtisch Sitzen* einzuschalten, wodurch der Channel im Exec Binding getriggert wird.
![Sitemap](/static/img/posts/smart-idasen/04.jpg)

Voilà, nun kan der Schreibtisch mit dem Befehl "*Hey Google, fahre den Schreibtisch hoch*" gesteuert werden. Das Vorgehen übertragen wir natürlich auch auf die gegensätzliche Bewegungsrichtung.

## Ein weiteres nützliches Addon

Im GitHub-Repo [idasen-rest-bridge](https://github.com/huserben/idasen-rest-bridge) findet sich eine sehr nützliche Erweiterung für diejenigen, die unabhängig von einer bestimmten Smarthome-Hub-Lösung ihren Schreibtisch nur über REST-Befehle steuern wollen. Diese Bridge verwendet unter der Haube ebenfalls das *idasen-python-cli* und legt eine REST-API darüber. Dies ist auch eine gute Option, falls man in Openhab auf das Exec-Binding verzichten möchte.

## Das war's

Nun haben wir einen an sich bereits sehr guten Schreibtisch noch ein Stückchen besser gemacht, ohne ihn technisch manipulieren zu müssen. Zwar ist die Reaktionszeit nach dem Befehl mit bis zu 7 Sekunden recht lange (das python-Script muss erst eine Verbindung zum Schreibtisch aufbauen, wenn dieser längere Zeit nicht adressiert wurde), aber dabei kann ich zumindest ein Auge zudrücken, da die Steuerung eines Schreibtisches für mich keinen Echtzeit-Usecase darstellt. Viel Spaß beim nachbauen!
