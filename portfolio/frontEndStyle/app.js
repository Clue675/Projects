(function () {
    //Here this function is basically selecting all classes named *Control*
    //Then since the parent element has the *Active button class* This function removes it form the parent and switches from child to the next. 

    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    //Light mode Toggle, the coolest thing on the page other than my awesome picture.//
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();