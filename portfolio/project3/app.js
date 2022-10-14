var coffee_form = document.getElementById("coffee_form")
var coffee_amount = document.getElementById("coffee_amount")
var cake_amount = document.getElementById("cake_amount")
var muffin_amount = document.getElementById("muffin_amount")
var total_amount = document.getElementById("total_amount")
var btn = document.getElementById("btn")
var coffee_cost = 11;
var cake_cost = 5;
var muffin_cost = 3;

coffee_form.addEventListener("submit", (e) => {
    e.preventDefault()
    coffee_total_cost = coffee_amount.value * coffee_cost
    cake_total_cost = cake_amount.value * cake_cost
    muffin_total_cost = muffin_amount.value * muffin_cost
    total_cost = coffee_total_cost + cake_total_cost + muffin_total_cost
    total_amount.innerHTML = `Order Total:$${total_cost}`
})
