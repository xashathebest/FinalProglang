package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"math"
	"net/http"
	"strconv"
)

func servePage(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/index.html"))
	tmpl.Execute(w, nil)
}

func serveOverview(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/overview.html"))
	tmpl.Execute(w, nil)
}

func serveAbout(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/aboutus.html"))
	tmpl.Execute(w, nil)
}

func serveSolve(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/solve.html"))
	tmpl.Execute(w, nil)
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
	mode := r.URL.Query().Get("mode")
	w.Header().Set("Content-Type", "application/json")

	switch mode {
	case "fibonacci":
		n, _ := strconv.Atoi(r.URL.Query().Get("n"))
		explanation := explainFibonacci(n)
		json.NewEncoder(w).Encode(map[string]interface{}{"explanation": explanation})

	case "factorial":
		n, _ := strconv.Atoi(r.URL.Query().Get("n"))
		explanation := explainFactorial(n)
		json.NewEncoder(w).Encode(map[string]interface{}{"explanation": explanation})

	case "quadratic":
		a, _ := strconv.ParseFloat(r.URL.Query().Get("a"), 64)
		b, _ := strconv.ParseFloat(r.URL.Query().Get("b"), 64)
		c, _ := strconv.ParseFloat(r.URL.Query().Get("c"), 64)

		var xVals, yVals []float64
		for x := -10.0; x <= 10.0; x += 0.5 {
			xVals = append(xVals, math.Round(x*100)/100)
			y := a*x*x + b*x + c
			yVals = append(yVals, math.Round(y*100)/100)
		}

		// Calculate roots
		discriminant := b*b - 4*a*c
		var roots string

		if discriminant > 0 {
			r1 := (-b + math.Sqrt(discriminant)) / (2 * a)
			r2 := (-b - math.Sqrt(discriminant)) / (2 * a)
			roots = fmt.Sprintf("Two real roots: x₁ = %.2f, x₂ = %.2f", r1, r2)
		} else if discriminant == 0 {
			r := -b / (2 * a)
			roots = fmt.Sprintf("One real root: x = %.2f", r)
		} else {
			roots = "No real roots (discriminant < 0)"
		}

		explanation := explainQuadratic(a, b, c)

		json.NewEncoder(w).Encode(map[string]interface{}{
			"x":      xVals,
			"y":      yVals,
			"roots":  roots,
			"explanation": explanation,
		})

	case "prime":
		n, _ := strconv.Atoi(r.URL.Query().Get("n"))
		explanation := explainPrimes(n)
		json.NewEncoder(w).Encode(map[string]interface{}{"explanation": explanation})

	}
}
