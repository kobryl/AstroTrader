function fadeOutLanding() {
    const landingSection = document.querySelector('#landing-section');
    landingSection.style.opacity = 0;
    document.querySelector("#connect-popup-button").style.cursor = "initial";
    setTimeout(() => {
        landingSection.style.display = 'none';
    }, 1000);
}