package main

import (
    "fmt"
    "math"
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

func explainQuadratic(a, b, c float64) string {
    explanation := ""
    explanation += fmt.Sprintf("Given quadratic equation: y = %.2fx² + %.2fx + %.2f\n", a, b, c)
    D := b*b - 4*a*c
    explanation += fmt.Sprintf("Discriminant (D) = b² - 4ac = %.2f² - 4*%.2f*%.2f = %.2f\n", b, a, c, D)
    if D > 0 {
        r1 := (-b + math.Sqrt(D)) / (2 * a)
        r2 := (-b - math.Sqrt(D)) / (2 * a)
        explanation += fmt.Sprintf("D > 0: Two real roots exist.\nRoot 1: x₁ = (-b + √D) / 2a = (%.2f + √%.2f) / (2*%.2f) = %.2f\nRoot 2: x₂ = (-b - √D) / 2a = (%.2f - √%.2f) / (2*%.2f) = %.2f\n", -b, D, a, r1, -b, D, a, r2)
    } else if D == 0 {
        r := -b / (2 * a)
        explanation += fmt.Sprintf("D = 0: One real root exists.\nRoot: x = -b / 2a = %.2f / (2*%.2f) = %.2f\n", -b, a, r)
    } else {
        explanation += "D < 0: No real roots exist (the parabola does not cross the x-axis).\n"
    }
    vx := -b / (2 * a)
    vy := a*vx*vx + b*vx + c
    explanation += fmt.Sprintf("Vertex: x_v = -b / 2a = %.2f / (2*%.2f) = %.2f\n", -b, a, vx)
    explanation += fmt.Sprintf("Vertex coordinates: (x_v, y_v) = (%.2f, %.2f)\n", vx, vy)
    explanation += "The vertex represents the maximum or minimum point of the parabola.\n"
    return explanation
}
