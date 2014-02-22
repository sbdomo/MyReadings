<?php
//Déclaration des bases Calibre à utiliser
//donner un titre et le chemin relatif (par rapport au chemin de My Readings sur le serveur web)
//il peut y avoir plusieurs bases (ici calibre et calibre2)
$calibre=array(
	"Mes ebooks" => "../calibre/",
	"Mes ebooks 2" => "../calibre2/"
);

//langue utilisé dans My Readings
//Les valeurs sont pour l'instant fr ou en
//Les fichiers utilisés sont dans resources/locale/ : par exemple local_fr.json pour fr
//Les fichiers de traduction sont au format json. Il est possible de les modifier ou d'en rajouter
//Par exemple en créant le fichier local_toto.json et en mettant $language="toto";
$language="fr";

//Protection
//Pour activer la protection, mettre $protect=true;
//Pour la déactiver, mettre $protect=true;
//Définir le login et mot de passe dans $login et $pass
$protect=false;
$login="toto";
$pass="test";


//Contrôle parental - actif si $control=true, ignoré sinon.
//Pour ajouter des bibliothèques à la liste par défaut (de $calibre)
//si login2 et pass2 est utilisé
$control=false;
$limited=array(
	"Autre" => "../calibre3/"
);
$login2="toto2";
$pass2="test2";
?>