# WoW Housing Decor Browser – Vizsgaprojekt

-------------------------------------------

Ez a projekt egy World of Warcraft: Midnight kiegészitőjével bekerült Housing System dekoráció böngésző alkalmazás, amelyben a felhasználók 
különböző dekorációkat kereshetnek, szűrhetnek, részletesen megtekinthetnek és kedvencekhez adhatnak, későbbi "elővételhez".
-------------------------------------------
FIGYELEM!
A projekt kizárólag vizsgacélra készült, a dekorációk adatai nem feltétlen a valóságnak megfelelő információk!
-------------------------------------------

## Funkciók
- Felhasználói regisztráció és bejelentkezés
- Dekorációk listázása, keresése és szűrése
- Részletes dekorációs nézet lenyíló panellel
- Kedvencek kezelése (hozzáadás / eltávolítás)
- Reszponzív felület
- Django REST API + React frontend


-------------------------------------------

## Technológiák
- Frontend: React, Vite
- Backend: Django, Django REST Framework
- Adatbázis: SQLite
- Hitelesítés: Token alapú auth


-------------------------------------------

## Telepítés és futtatás
A webalkalmazáshoz mellékelve lettek nagyon egyszerű BAT kötegfájlok (egyfajta scriptek), ezekkel egyszerűen "telepithető" és inditható a program.
1.-installer.bat > Az Installer bat telepiti a szükséges eszközöket, mind backenden, mind frontend oldalon.
	-Backend oldalon > A 'requirements.txt' fájl alapján telepit.
		-DJango 6.0.2
		-DJango - Cors Headers 4.9.0
		-DJango Filter 25.2
		-DJango REST_Framework 3.16.1
		-DJango REST_Camel-Case 1.4.2
		-asgiref 3.11.1
		-PyJWT 2.12.1 (mellékes, jelenleg naturális AuthToken-t használ)
		-SQL-Parse 0.5.5
		-TZ Data 2025-3
		-Python PILLOW 12.2.0
	-Frontend oldalon > Az alapvető Package fájloknak köszönhetően közvetlen beállitás áll a frontend felett, igy csak a Node adott verzióját fogja telepiteni.
		-Node.JS 24.14.0 (LTS confirmed) - (A 21.0 verziók előtti modulkötegekkel NEM FOG ELINDULNI A FRONTEND!!!)

2.-decors_serverlauncher.bat > A Launcherünk egész egyszerűen csak nyit egy CMD-t a backenden és frontenden, majd mindkettőn elinditja a szervereket és 5 másodperces késéssel megnyitja a frontend által adott URL cimet az adott környezetnek beállitott alapértelmezett böngészővel.
	Később akár parancsikon létrehozásával is használható ezen keresztül az webalkalmazás.

3.-repair.bat > Ez egy nagyon-nagyon egyszerű újratelepitő, amely CSAK ÉS KIZÁRÓLAG a Node modulokat képes újratelepiteni, ha esetleg probléma merülne fel a modulok közötti kompatibilitással.