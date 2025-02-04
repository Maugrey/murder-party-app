@echo off
REM -----------------------------------------------------------------------------
REM Script : init_murder_party_app.bat
REM Objectif : Créer l'arborescence et des fichiers vides pour le projet React
REM -----------------------------------------------------------------------------




REM Dossier 'public' et ses fichiers
cd public
type nul > clues.json
cd ..

cd src

REM Composants
md components
cd components
type nul > Navigation.js
type nul > Timer.js
type nul > ResetGameButton.js
type nul > ConditionManager.js
cd ..

REM Pages
md pages
cd pages
type nul > Interroger.js
type nul > Fouiller.js
type nul > Acheter.js
type nul > Pensine.js
cd ..

REM Services
md services
cd services
type nul > dataService.js
type nul > textService.js
cd ..

echo Arborescence créée avec succès dans le dossier 'murder-party-app'.
pause
