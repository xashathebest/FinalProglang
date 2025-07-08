package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", servePage)
    http.HandleFunc("/overview", serveOverview)
    http.HandleFunc("/about", serveAbout)
    http.HandleFunc("/solve", serveSolve)
    http.HandleFunc("/calculate", calculateHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
    fmt.Println("Server running at http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
