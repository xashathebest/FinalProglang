package main

import (
    "fmt"
    "strings"
)

func explainFibonacci(n int) string {
    if n <= 0 {
        return "Fibonacci sequence requires a positive integer."
    }
    seq := []int{0}
    if n == 1 {
        return "Fibonacci(1): [0]"
    }
    seq = append(seq, 1)
    for i := 2; i < n; i++ {
        seq = append(seq, seq[i-1]+seq[i-2])
    }
    return fmt.Sprintf("Fibonacci(%d): %v\nExplanation: Each term is the sum of the two preceding terms.", n, seq)
}

func explainFactorial(n int) string {
    if n < 0 {
        return "Factorial is undefined for negative integers."
    }
    result := 1
    steps := []string{}
    for i := 1; i <= n; i++ {
        result *= i
        steps = append(steps, fmt.Sprintf("%d", i))
    }
    return fmt.Sprintf("%d! = %s = %d", n, strings.Join(steps, " × "), result)
}

func explainPrimes(count int) string {
    if count <= 0 {
        return "Input must be a positive number to generate primes."
    }
    primes := []int{}
    num := 2
    for len(primes) < count {
        if isPrime(num) {
            primes = append(primes, num)
        }
        num++
    }
    return fmt.Sprintf("First %d prime numbers: %v", count, primes)
}

func isPrime(n int) bool {
    if n < 2 {
        return false
    }
    for i := 2; i*i <= n; i++ {
        if n%i == 0 {
            return false
        }
    }
    return true
}
