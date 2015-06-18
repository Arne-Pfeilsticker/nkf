# NKF+ – Neues Kommunales Finanzmanagement Plus

NKF+ ist ein interaktives Werkzeug, mit dem kommunale Haushalte einfach und klar darzustellen und analysiert werden können.

Dieses Projekt befindet sich im Aufbau.

# Das Kerngeschäft der Gemeinden ist das Gemeinwohl!

Die Leistungen der Gemeinden für ihre Bürger und für das Gemeinwohl sichtbar und steuerbar zu machen,
wäre die Aufgabe einer kommunalen Rechnungslegung.

Stattdessen haben sich die Gemeinden mit der Doppik eine Rechnungslegung zugelegt, die für
gewinnorientierte Unternehmen konzipiert und optimiert wurde. Die Doppik führt in den Gemeinden zu
falschen Schlussfolgerungen und die angestrebten Ziele werden nicht erreicht.

Die Ziele des NKFs könnten selbst 10 Jahre nach Projektstart nicht viel besser formuliert werden. Leider blieben 
diese Ziele bei der Umsetzung auf der Strecke.

Das Ziel dieses Open Source Projektes für Kommunen ist eine Software für die Haushaltsführung, die den
Aufgaben und Bedürfnissen der Gemeinden gerecht wird.

## Warum soll ich mich mit der Rechnungslegung meiner Kommune beschäftigen?

Die Bedeutung der Rechnungslegung für Wirtschaft und Gesellschaft wird vielfach unterschätzt: 
* Eine einzige Änderung in den Rechnungslegungsvorschriften hätte z.B. die Finanzkrise 2007/2008 erst gar nicht entstehen lassen. 
* Selbst der schlechte Zustand unserer Straßen ist im Kern eine Folge der Rechnungslegung der Kommunen.

Die Begründung dieser Thesen und mehr Informationen zum Projekt: [Vortrag] (https://dl.dropboxusercontent.com/u/13031383/EuWiKon%202015_T2V3%20-%20NKF.mp4) und 
[Präsentation zum Vortrag](http://euwikon.eu/wordpress/wp-content/uploads/2015/01/EuWiKon-2015-Folien-NKF-Vortrag.key1.pdf)

# Installation (Anwendung)

NKF+ ist als als eine Erweiterung (Plugin) für das Datenbankmanagementsystem [OrientDB] (http://orientdb.com/) konzipiert.

1. Voraussetzung für die Installation der Datenbank und NKF-Anwendung ist leditlich [Java] (http://www.java.com/en/download/) 
in der Version >= 1.6.
1. Installiere OrientDB [Download] (http://orientdb.com/download/) [Installationsanleitung] (http://orientdb.com/docs/last/Tutorial-Installation.html)
1. Setze die Umgebungsvariable **ORIENTDB_HOME**, die das Installationsverzeichnis von OrientDB enthält.
1. Kopiere das **nkf**-Verzeichnis aus dem Verzeichnis **dist** in das Verzeichnis $ORIENTDB_HOME/plugins/
1. Entpacke die **dist/nkfDatabase.zip**-Datei im Verzeichnis $ORIENTDB_HOME/databases. 
Das erstellte Verzeichnis nkf enthält die nkf-Datenbank mit den Strukturdaten für das Bundesland NRW aber ohne Haushaltsdaten.
Kontaktiere mich für eine Datenbank mit Haushaltsdaten.
1. Mit dem Aufruf [http://localhost:2480/studio/index.html#] (http://localhost:2480/studio/index.html#/) 
erscheint das [OrientDB-Studio] (http://orientdb.com/docs/last/Home-page.html), 
eine Web-Benutzerinterface zur Administration von OrientDB. Hier kann man sich direkt an der Datenbank nkf anmelden.
1. Mit dem Aufruf [http://localhost:2480/nkf/index.html#/] (http://localhost:2480/nkf/index.html#/) kommt man zur NKF-Anwendung.
(Im Moment sieht man nur die Home-Seite.)

# Installation (Entwicklung)

NKF ist eine [AngularJS] (http://de.wikipedia.org/wiki/AngularJS)-Web-Anwendung, die [OrientDB] (http://orientdb.com/) 
als Datenbank und Web-Server nutzt. Der im [OrientDB Server] (http://orientdb.com/docs/last/DB-Server.html) 
integrierte Web-Server vereinfacht die Installation und den Betrieb der Anwendung erheblich.
 
Wer Jetbrains [WebStorm] (https://www.jetbrains.com/webstorm/?fromMenu)-IDE nutzt kann das Projekt wie folgt auf dem eigenen PC
installieren. Das WebStrom-Konfigurationsverzeichnis *.idea* wird mitgeliefert.

1. Installiere OrientDB [Download] (http://orientdb.com/download/) [Installationsanleitung] (http://orientdb.com/docs/last/Tutorial-Installation.html)
1. Setze die Umgebungsvariable **ORIENTDB_HOME**, die das Installationsverzeichnis von OrientDB enthält.
1. Fork auf GitHub dieses Repo [Arne-Pfeilsticker / nkf] (https://github.com/Arne-Pfeilsticker/nkf)
1. Öffne WebStorm und *Check out from Version Control GitHub* (Ohne Webstorm: Clone das Projekt in ein Verzeichnis eigener Wahl.)
1. Nachdem das Projekt geöffnet wurde öffne ein Terminal Fenster und führe folgende Befehle aus, um die erforderlichen 
Node-Module und Bower-Komponenten herunter zu laden:
    1. npm install
    1. bower install
1. Mit dem Befehl *grunt --gruntfile GruntOrientDB.js orientDBCreateAndLoad* wird die Datenbank neu aufgebaut und mit den Basis-Daten geladen.
1. Mit dem Befehl *grunt default* wird die Anwendung / das Plugin neu aufgebaut.
1. Mit dem Befehl *grunt --gruntfile GruntOrientDB.js orientPlugin* wird das erstellte Plugin in das Verzeichnis *$ORIENTDB_HOME/plugins* der Datenbank kopiert. 
1. Danach ist die Installation abgeschlossen.

Ich freue mich über jeden, der sich für dieses Projekt interessiert und stehe für Fragen gerne zur Verfügung.
Mein Skype name ist *arne.pfeilsticker* und die Email-Adresse: Arne.Pfeilsticker@pfeilsticker.de

(c) 2015 Arne Pfeilsticker