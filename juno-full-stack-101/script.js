const app = {};

app.answer = document.getElementsByClassName('answer');

app.popup = true;

app.config = () => {
    const config = {
        apiKey: "AIzaSyC60-QZt3b-SH5_SkI2eDrVb58F15HqNmY",
        authDomain: "five-stars-test.firebaseapp.com",
        databaseURL: "https://five-stars-test.firebaseio.com",
        projectId: "five-stars-test",
        storageBucket: "",
        messagingSenderId: "406735455891"
    };
    firebase.initializeApp(config);
    app.database = firebase.database();
    app.score = app.database.ref('/date');
}

app.getTheDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    console.log(month);
    const fullDate = `${day}-${month}-${year}`;
    return fullDate;
}

app.answerListener = (e) => {
    const date = app.getTheDate();
    const score = e.target.id;
    const database = app.database.ref(`/date/${date}/${score}/`);
    let oldScore;
    database.once('value').then((snapshot) => {
        oldScore = snapshot.val();
        const newScore = oldScore + 1;
        app.addOne(database, newScore);
    });
}

app.animateSubmit = () => {
    const surveys = document.querySelectorAll('.question');
    for (let i = 0; i < surveys.length; i = i + 1) {
        surveys[i].innerHTML = `<p>🎉Thanks for your feedback!🎉</p>`;
    }
    setTimeout(() => {
        app.closePopup();
    }, 800);
}

app.addOne = (database, score) => {
    database.set(score);
    for (let i = 0; i < app.answer.length; i++) {
        app.answer[i].classList.add('hidden');
    }
    setTimeout(() => {
        app.animateSubmit();
    }, 250);
}

app.isInView = (element) => {
    const scroll = window.scrollY || window.pageYOffset;
    const boundsTop = element.getBoundingClientRect().top + scroll;
    const viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight
    }
    const bounds = {
        top: boundsTop,
        bottom: boundsTop + element.clientHeight,
    }
    return (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom)
        || (bounds.top <= viewport.bottom && bounds.top >= viewport.top);
} 

app.navigationHighlight = () => {
    const hooks = document.querySelectorAll('.hook');
    hooks.forEach((hook) => {
        const id = hook.id;
        const listOfLinks = document.querySelectorAll(`a[href='#${id}']`);
        if (app.isInView(hook)) {
            listOfLinks.forEach((a) => {
                a.classList.add('active');
            });
        } else {
            listOfLinks.forEach((a) => {
                a.classList.remove('active');
            });
        }
    });
}

app.askForFeedback = () => {
    if (app.popup) {
        document.querySelector('#popup').className = 'popup show';
    }
}

app.closePopup = () => {
    document.querySelector('.popup').className = 'popup hidden';
    app.popup = false;
}

app.listenForClose = (e) => {
    console.log(e);
    if (e.keyCode === 27 || e.key === "Escape" || e.key === "`") {
        app.closePopup();
    }
}

app.listeners = () => {
    window.addEventListener('scroll', app.navigationHighlight);
    document.querySelector('#popUpOpen').addEventListener('mouseover', app.askForFeedback);
    window.addEventListener('keydown', app.listenForClose);
    document.querySelector('.close').addEventListener('click', app.closePopup);
    for (let i = 0; i < app.answer.length; i++) {
        app.answer[i].addEventListener('click', app.answerListener, false);
    }
}

app.init = () => {
    app.config();
    app.navigationHighlight();
    app.listeners();
}

document.addEventListener("DOMContentLoaded", () => {
    app.init();
});


