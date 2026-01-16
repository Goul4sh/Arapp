import styles from './Selector.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {faPlay, faBook} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import {useState} from "react";

// Prototypowa strona do wybierania ćwiczeń

// Ta strona powinna zostac ostatecznie przeksztalcona w modul tworzenia skladanek cwiczen,
// ktory w swojej funkcjonalnosci bedzie bardzo zblizony do kreatora zadan z widoku admina.
// Bedzie mozna wybierac typy zadan dostepne w aplikacji i na bazie dostepnych zasobow tworzyc kolejki zadan.
// Na przyklad tylko zadania na dopasowywanie lub zaznaczanie poprawnych odpowiedzi (kilku)

// Skoro bierze pod uwage moduł słownictwa, a nawet przed wprowadzeniem ogólnej listy słów, mozna dodac rozdzielanie
// dostepnych slow do formatu wymaganego przez zadanie zwiazane z zadaniami morfologicznymi.
// Dodatkowo jesli kazde slowo z fiszki ma swoje tlumaczenie, to mozna je dynamicznie dodawac do zadan typu choose one, albo match pair


function ExerciseSelector() {






    return (

            <div className={styles.exercisePage}>


            </div>


    );
}

export default ExerciseSelector;