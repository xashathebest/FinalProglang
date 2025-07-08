// Global variables
let mode = "quadratic";
let selectedFunction = null;
let chart;
let fibCanvas = null;

// DOM elements - will be initialized after page loads
let form, inputArea, output, ctx, modeTitle, chartContainer, fibonacciSpiral, calculatorInterface, functionButtons;

// Initialize DOM elements after page loads
function initializeElements() {
    form = document.getElementById('calcForm');
    inputArea = document.getElementById('inputArea');
    output = document.getElementById('output');
    const chartElement = document.getElementById('chart');
    if (chartElement) {
        ctx = chartElement.getContext('2d');
    }
    modeTitle = document.getElementById('modeTitle');
    chartContainer = document.getElementById('chart-container');
    fibonacciSpiral = document.getElementById('fibonacci-spiral');
    calculatorInterface = document.getElementById('calculator-interface');
    functionButtons = document.getElementById('function-buttons');
    
    console.log('DOM elements initialized:', {
        form: !!form,
        inputArea: !!inputArea,
        output: !!output,
        ctx: !!ctx,
        modeTitle: !!modeTitle,
        chartContainer: !!chartContainer,
        fibonacciSpiral: !!fibonacciSpiral,
        calculatorInterface: !!calculatorInterface,
        functionButtons: !!functionButtons
    });
}

// Navigation system
function showPage(pageName, event) {
    console.log('showPage called with:', pageName);

    if (event) {
        event.preventDefault();
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        console.log('Showing page:', pageName);
    } else {
        console.error('Page not found:', pageName);
    }

    // Update navigation active state (only for nav links)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-blue-600');
        link.classList.add('text-gray-600');
    });

    // Highlight active nav link if clicked element is a nav-link
    if (event && event.target && event.target.classList.contains('nav-link')) {
        event.target.classList.remove('text-gray-600');
        event.target.classList.add('text-blue-600');
    }
}
// Dynamic 3-button system
function selectFunction(functionName) {
    console.log('selectFunction called with:', functionName);
    selectedFunction = functionName;
    
    if (!functionButtons) {
        console.error('functionButtons not found');
        return;
    }
    
    // Hide the selected button
    const buttons = functionButtons.querySelectorAll('.function-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase() === functionName) {
            btn.style.display = 'none';
            console.log('Hiding button:', functionName);
        }
    });
    
    // Show calculator interface
    if (calculatorInterface) {
        calculatorInterface.classList.remove('hidden');
        console.log('Showing calculator interface');
    }
    
    // Set the mode and update UI
    setMode(functionName);
    
    // Update button states to show only 3 buttons
    updateFunctionButtons();
}

function updateFunctionButtons() {
    if (!functionButtons) return;
    
    const buttons = functionButtons.querySelectorAll('.function-btn');
    const visibleButtons = Array.from(buttons).filter(btn => btn.style.display !== 'none');
    
    console.log('Visible buttons:', visibleButtons.length);
    
    // Ensure exactly 3 buttons are visible (excluding the selected one)
    if (visibleButtons.length > 3) {
        // Hide the last visible button to maintain 3 visible buttons
        visibleButtons[visibleButtons.length - 1].style.display = 'none';
    }
}

function resetFunctionButtons() {
    console.log('resetFunctionButtons called');
    
    if (!functionButtons) return;
    
    const buttons = functionButtons.querySelectorAll('.function-btn');
    buttons.forEach(btn => {
        btn.style.display = 'inline-block';
    });
    selectedFunction = null;
    
    if (calculatorInterface) {
        calculatorInterface.classList.add('hidden');
    }
    
    // Clear output
    if (output) output.innerHTML = '';
    
    // Hide chart and spiral
    if (chartContainer) chartContainer.classList.add('hidden');
    if (fibonacciSpiral) fibonacciSpiral.classList.add('hidden');
    // removeFibFlexRow(); // No longer needed
}

function initChart() {
    if (chart) chart.destroy();
    
    if (!ctx || !chartContainer) {
        console.error('Chart context or container not available');
        return;
    }
    
    ctx.canvas.width = chartContainer.offsetWidth;
    ctx.canvas.height = chartContainer.offsetHeight;
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Function',
                borderColor: '#2563eb',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                tension: 0.1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    title: { display: true, text: 'x-axis' },
                    grid: {
                        color: ctx => ctx.tick.value === 0 ? 'rgba(37, 99, 235, 0.8)' : 'rgba(37, 99, 235, 0.8)'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    title: { display: true, text: 'y-axis' },
                    grid: {
                        color: ctx => ctx.tick.value === 0 ? 'rgba(37, 99, 235, 0.8)' : 'rgba(37, 99, 235, 0.8)'
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: 'xy' },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy'
                    }
                }
            }
        }
    });
    
    const hammer = new Hammer(chart.canvas);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    
    let lastPanX = 0, lastPanY = 0;
    hammer.on('panstart', () => { lastPanX = 0; lastPanY = 0; });
    hammer.on('pan', (e) => {
        const deltaX = e.deltaX - lastPanX;
        const deltaY = e.deltaY - lastPanY;
        chart.pan({
            x: -deltaX / chart.scales.x.pixelsPerUnit,
            y: deltaY / chart.scales.y.pixelsPerUnit
        });
        lastPanX = e.deltaX;
        lastPanY = e.deltaY;
        chart.update('none');
    });
}

function calculateVertex(a, b, c) {
    const vertexX = -b / (2 * a);
    return { x: vertexX, y: a * vertexX * vertexX + b * vertexX + c };
}

// Animation helpers
function animateIn(element, animationClass = 'fade-in') {
    if (!element) return;
    element.classList.remove('fade-in', 'slide-in');
    void element.offsetWidth; // trigger reflow
    element.classList.add(animationClass);
    element.style.opacity = 1;
}
function animateOut(element, animationClass = 'fade-out') {
    if (!element) return;
    element.classList.remove('fade-in', 'slide-in');
    void element.offsetWidth;
    element.classList.add(animationClass);
    element.style.opacity = 0;
}
// Add animation CSS
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    .fade-in { animation: fadeInAnim 0.7s cubic-bezier(.4,0,.2,1); opacity: 1 !important; }
    .fade-out { animation: fadeOutAnim 0.5s cubic-bezier(.4,0,.2,1); opacity: 0 !important; }
    .slide-in { animation: slideInAnim 0.7s cubic-bezier(.4,0,.2,1); opacity: 1 !important; }
    @keyframes fadeInAnim { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOutAnim { from { opacity: 1; } to { opacity: 0; } }
    @keyframes slideInAnim { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }
    `;
    document.head.appendChild(style);
})();

function setMode(m) {
    console.log('setMode called with:', m);
    mode = m;
    if (output) output.textContent = "";
    
    if (m === "quadratic") {
        if (chartContainer) {
            chartContainer.classList.remove('hidden');
            animateIn(chartContainer, 'slide-in');
        }
        if (fibonacciSpiral) fibonacciSpiral.classList.add('hidden');
        // removeFibFlexRow(); // No longer needed
        if (!chart) initChart();
        if (inputArea) {
            inputArea.innerHTML = `
                <input name="a" placeholder="a" value="1" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <input name="b" placeholder="b" value="0" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <input name="c" placeholder="c" value="0" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            `;
        }
    } else if (m === "fibonacci") {
        if (chartContainer) chartContainer.classList.add('hidden');
        if (fibonacciSpiral) {
            fibonacciSpiral.classList.remove('hidden');
            animateIn(fibonacciSpiral, 'slide-in');
        }
        if (inputArea) {
            inputArea.innerHTML = `<input name="n" placeholder="Enter n" value="10" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">`;
        }
        // createFibFlexRow(); // No longer needed
        drawFibonacciSpiral(10); // default
    } else {
        if (chartContainer) chartContainer.classList.add('hidden');
        if (fibonacciSpiral) fibonacciSpiral.classList.add('hidden');
        // removeFibFlexRow(); // No longer needed
        if (inputArea) {
            inputArea.innerHTML = `<input name="n" placeholder="Enter n" value="10" class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">`;
        }
    }
    if (modeTitle) modeTitle.textContent = `${m.charAt(0).toUpperCase() + m.slice(1)} Calculator`;
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    if (inputArea) {
        inputArea.addEventListener('input', (e) => {
            if (mode === 'fibonacci') {
                const n = parseInt(e.target.value) || 1;
                drawFibonacciSpiral(Math.max(2, Math.min(n, 12)));
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted for mode:', mode);
            
            const formData = new FormData(form);
            const params = new URLSearchParams();
            if (mode === "quadratic") {
                params.append('a', formData.get('a'));
                params.append('b', formData.get('b'));
                params.append('c', formData.get('c'));
            } else {
                params.append('n', formData.get('n'));
            }
            try {
                const response = await fetch(`/calculate?mode=${mode}&${params.toString()}`);
                const data = await response.json();
                if (mode === "quadratic") {
                    const a = parseFloat(formData.get('a'));
                    const b = parseFloat(formData.get('b'));
                    const c = parseFloat(formData.get('c'));
                    const vertex = calculateVertex(a, b, c);
                    const datasets = [{
                        label: `y = ${a}x² + ${b}x + ${c}`,
                        borderColor: '#2563eb',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 0,
                        data: data.x.map((x, i) => ({x, y: data.y[i]}))
                    }, {
                        label: 'Vertex',
                        backgroundColor: '#dc2626',
                        borderColor: '#dc2626',
                        pointRadius: 8,
                        pointHoverRadius: 10,
                        data: [vertex],
                        pointStyle: 'circle'
                    }];
                    if (data.roots.includes("x₁")) {
                        const rootsText = data.roots.match(/x₁ = ([\d.-]+), x₂ = ([\d.-]+)/);
                        if (rootsText) {
                            const root1 = parseFloat(rootsText[1]);
                            const root2 = parseFloat(rootsText[2]);
                            datasets.push({
                                label: 'Roots',
                                backgroundColor: '#059669',
                                borderColor: '#059669',
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                data: [
                                    {x: root1, y: 0},
                                    {x: root2, y: 0}
                                ],
                                pointStyle: 'rectRot'
                            });
                        }
                    } else if (data.roots.includes("x =")) {
                        const rootText = data.roots.match(/x = ([\d.-]+)/);
                        if (rootText) {
                            const root = parseFloat(rootText[1]);
                            datasets.push({
                                label: 'Root',
                                backgroundColor: '#059669',
                                borderColor: '#059669',
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                data: [{x: root, y: 0}],
                                pointStyle: 'rectRot'
                            });
                        }
                    }
                    chart.data.datasets = datasets;
                    chart.update();
                    // Show roots and vertex clearly
                    if (output) {
                        output.innerHTML = `<div class="mb-4"><strong>Roots:</strong> ${data.roots}</div><div class="mb-4"><strong>Vertex:</strong> (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})</div>` +
                            `<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900"><div class="font-semibold mb-2 text-blue-700">Step-by-step Explanation:</div><pre style='white-space:pre-wrap;font-family:inherit;'>${data.explanation}</pre></div>`;
                    }
                } else if (mode === 'fibonacci') {
                    const n = parseInt(formData.get('n')) || 10;
                    drawFibonacciSpiral(Math.max(2, Math.min(n, 12)));
                    // Parse explanation for step-by-step
                    let explanation = data.explanation || '';
                    let [seqLine, ...explanationLines] = explanation.split(/\n|<br>/);
                    let stepsHtml = '';
                    if (explanationLines.length > 0) {
                        stepsHtml = `<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                            <div class="font-semibold mb-2 text-blue-700">Step-by-step Explanation:</div>
                            <ul class="list-disc pl-6">
                                <li>Start with 0 and 1.</li>
                                <li>Each next term is the sum of the two preceding terms.</li>
                                <li>Continue until you have ${n} terms.</li>
                            </ul>
                            <div class="mt-2 text-blue-800">${explanationLines.join('<br>')}</div>
                        </div>`;
                    }
                    if (output) {
                        output.innerHTML = `<div class="mb-4"><strong>Fibonacci Sequence:</strong></div><div class="mb-4">${seqLine}</div>${stepsHtml}`;
                    }
                } else {
                    if (output) {
                        output.innerHTML = `<div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">${data.explanation}</div>`;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (output) {
                    output.innerHTML = `<div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">Error: ${error.message}</div>`;
                }
            }
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize DOM elements
    initializeElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome page by default
    showPage('welcome');
    
    console.log('App initialization complete');
});