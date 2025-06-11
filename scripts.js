
    // --- 通用設定與函式 ---
    const SORT_ARRAY_SIZE = 35;
    const ANIMATION_SPEED = 150;
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    async function barSwap(bars, i, j, targetArray) {
    let tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;
    let tempText = bars[i].firstChild.innerText;
    bars[i].firstChild.innerText = bars[j].firstChild.innerText;
    bars[j].firstChild.innerText = tempText;
    [targetArray[i], targetArray[j]] = [targetArray[j], targetArray[i]];
    await sleep(ANIMATION_SPEED);
}
    function createSvgElement(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let k in attrs) {
    if (k === 'content') el.textContent = attrs[k];
    else el.setAttribute(k, attrs[k]);
}
    return el;
}

    // --- 排序演算法通用 ---
    function generateSortingArray(container, array, btn) {
    if(!container) return;
    array.length = 0;
    container.innerHTML = '';
    for (let i = 0; i < SORT_ARRAY_SIZE; i++) {
    const value = Math.floor(Math.random() * 96) + 5;
    array.push(value);
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value * (container.clientHeight / 110)}px`;
    const barLabel = document.createElement('span');
    barLabel.innerText = value;
    bar.appendChild(barLabel);
    container.appendChild(bar);
}
    btn.disabled = false;
}

    // --- 選擇排序 (Selection Sort) ---
    const selectionContainer = document.getElementById('selection-chart-container');
    const selectionSortBtn = document.getElementById('selectionSortBtn');
    const selectionResetBtn = document.getElementById('selectionResetBtn');
    let selectionArray = [];

    function generateSelectionArray() { generateSortingArray(selectionContainer, selectionArray, selectionSortBtn); }
    async function selectionSort() {
    selectionSortBtn.disabled = true; selectionResetBtn.disabled = true;
    const bars = selectionContainer.getElementsByClassName('bar');
    for (let i = 0; i < selectionArray.length - 1; i++) {
    let min_idx = i;
    bars[min_idx].classList.add('bar-min');
    for (let j = i + 1; j < selectionArray.length; j++) {
    bars[j].classList.add('bar-compare');
    await sleep(ANIMATION_SPEED);
    if (selectionArray[j] < selectionArray[min_idx]) {
    bars[min_idx].classList.remove('bar-min');
    min_idx = j;
    bars[min_idx].classList.add('bar-min');
}
    bars[j].classList.remove('bar-compare');
}
    await barSwap(bars, min_idx, i, selectionArray);
    bars[i].classList.add('bar-sorted');
    if(bars[min_idx]) bars[min_idx].classList.remove('bar-min');
}
    if(selectionArray.length > 0) bars[selectionArray.length-1].classList.add('bar-sorted');
    selectionResetBtn.disabled = false;
}
    selectionSortBtn.addEventListener('click', selectionSort);
    selectionResetBtn.addEventListener('click', generateSelectionArray);

    // --- 快速排序 (Quick Sort) ---
    const quicksortContainer = document.getElementById('quicksort-chart-container');
    const quicksortSortBtn = document.getElementById('quicksortSortBtn');
    const quicksortResetBtn = document.getElementById('quicksortResetBtn');
    let quicksortArray = [];

    function generateQuicksortArray() { generateSortingArray(quicksortContainer, quicksortArray, quicksortSortBtn); }
    async function quicksortPartition(bars, low, high) {
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    await barSwap(bars, randomIndex, high, quicksortArray);
    const pivotValue = quicksortArray[high];
    let pivotIndex = low - 1;
    bars[high].classList.add('bar-pivot');
    for (let j = low; j < high; j++) {
    bars[j].classList.add('bar-compare');
    await sleep(ANIMATION_SPEED);
    if (quicksortArray[j] < pivotValue) {
    pivotIndex++;
    await barSwap(bars, pivotIndex, j, quicksortArray);
}
    bars[j].classList.remove('bar-compare');
}
    await barSwap(bars, pivotIndex + 1, high, quicksortArray);
    bars[high].classList.remove('bar-pivot');
    bars[pivotIndex + 1].classList.add('bar-sorted');
    return pivotIndex + 1;
}
    async function quickSort(low, high) {
    if (low >= high) {
    if (low >= 0 && low < quicksortArray.length) {
    quicksortContainer.getElementsByClassName('bar')[low].classList.add('bar-sorted');
} return;
}
    const bars = quicksortContainer.getElementsByClassName('bar');
    const partitionIndex = await quicksortPartition(bars, low, high);
    await Promise.all([ quickSort(low, partitionIndex - 1), quickSort(partitionIndex + 1, high) ]);
}
    async function startQuicksort() {
    quicksortSortBtn.disabled = true; quicksortResetBtn.disabled = true;
    await quickSort(0, quicksortArray.length - 1);
    quicksortResetBtn.disabled = false;
}
    quicksortSortBtn.addEventListener('click', startQuicksort);
    quicksortResetBtn.addEventListener('click', generateQuicksortArray);

    // --- 串列 (List / Linked List) ---
    const listSvg = document.getElementById('list-svg');
    const listSvgContainer = document.getElementById('list-svg-container');
    const listInput = document.getElementById('list-input');
    const addHeadBtn = document.getElementById('list-add-head-btn');
    const addTailBtn = document.getElementById('list-add-tail-btn');
    const deleteBtn = document.getElementById('list-delete-btn');
    const listResetBtn = document.getElementById('list-reset-btn');

    class ListNode { constructor(value, next = null) { this.value = value; this.next = next; } }
    class LinkedList {
    constructor() { this.head = null; this.size = 0; }
    addToHead(value) { this.head = new ListNode(value, this.head); this.size++; }
    addToTail(value) {
    const newNode = new ListNode(value);
    if (!this.head) { this.head = newNode; }
    else { let current = this.head; while (current.next) { current = current.next; } current.next = newNode; }
    this.size++;
}
    delete(value) {
    if (!this.head) return false;
    if (this.head.value === value) { this.head = this.head.next; this.size--; return true; }
    let current = this.head;
    while (current.next && current.next.value !== value) { current = current.next; }
    if (current.next) { current.next = current.next.next; this.size--; return true; }
    return false;
}
}
    const list = new LinkedList();

    async function drawList() {
    if(!listSvg) return;
    listSvg.innerHTML = '';
    const containerWidth = listSvgContainer.clientWidth;
    const containerHeight = listSvgContainer.clientHeight;
    const DEF_NODE_WIDTH = 70, DEF_GAP = 60, DEF_FONT_SIZE = 18, NODE_HEIGHT = 40;
    const HEAD_SPACE = 60, NULL_SPACE = 80;
    const availableWidth = containerWidth - HEAD_SPACE - NULL_SPACE;
    let scale = 1;
    const requiredWidth = list.size * DEF_NODE_WIDTH + (list.size > 0 ? (list.size - 1) * DEF_GAP : 0);
    if (list.size > 0 && requiredWidth > availableWidth) {
    scale = availableWidth / requiredWidth;
}
    const nodeWidth = DEF_NODE_WIDTH * scale;
    const gap = DEF_GAP * scale;
    const fontSize = Math.max(10, DEF_FONT_SIZE * scale);
    const startY = containerHeight / 2 - NODE_HEIGHT / 2;
    const startX = HEAD_SPACE;

    const headLabel = createSvgElement('text', { x: startX - 35, y: startY + NODE_HEIGHT / 2 + 5, class: 'node-label', content: 'HEAD', 'text-anchor': 'middle' });
    listSvg.appendChild(headLabel);

    const defs = createSvgElement('defs', {});
    defs.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34495e" /></marker><filter id="shatter-filter"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.4" numOctaves="1" result="turbulence"/><feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    listSvg.appendChild(defs);

    if (list.head === null) {
    const nullX = startX + 30;
    const headPointer = createSvgElement('line', { x1: startX, y1: startY + NODE_HEIGHT / 2, x2: nullX, y2: startY + NODE_HEIGHT / 2, class: 'list-pointer', 'marker-end': 'url(#arrow)' });
    const nullLabel = createSvgElement('text', { x: nullX + 35, y: startY + NODE_HEIGHT / 2 + 5, class: 'node-label', content: 'NULL', 'text-anchor': 'middle' });
    listSvg.append(headPointer, nullLabel);
} else {
    let current = list.head, i = 0;
    while (current) {
    const x = startX + i * (nodeWidth + gap);
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${x}, ${startY})`, id: `list-node-${i}` });
    const rect = createSvgElement('rect', { class:'node-rect', width: nodeWidth, height: NODE_HEIGHT, rx: 8 });
    const text = createSvgElement('text', { class:'node-text', style: `font-size: ${fontSize}px;`, x: nodeWidth / 2, y: NODE_HEIGHT / 2 + 8, 'text-anchor': 'middle', content: current.value });
    g.append(rect, text);
    listSvg.appendChild(g);

    if (current.next) {
    const pointer = createSvgElement('line', { x1: x + nodeWidth, y1: startY + NODE_HEIGHT / 2, x2: x + nodeWidth + gap, y2: startY + NODE_HEIGHT / 2, class: 'list-pointer', 'marker-end': 'url(#arrow)' });
    listSvg.appendChild(pointer);
} else {
    const nullLabel = createSvgElement('text', { x: x + nodeWidth + NULL_SPACE / 2, y: startY + NODE_HEIGHT / 2 + 5, class: 'node-label', content: 'NULL', 'text-anchor': 'middle' });
    listSvg.appendChild(nullLabel);
}
    current = current.next; i++;
}
}
}

    function generateInitialList() {
    list.head = null; list.size = 0;
    [10, 25, 5].forEach(val => list.addToTail(val));
    drawList();
}

    async function handleListAdd(isHead) {
    const value = parseInt(listInput.value);
    if (isNaN(value)) { alert("請輸入有效的數字！"); return; }
    setListButtons(false);
    if (isHead) list.addToHead(value); else list.addToTail(value);
    await drawList();
    const newNodeIndex = isHead ? 0 : list.size - 1;
    const targetNode = document.getElementById(`list-node-${newNodeIndex}`);
    if (targetNode) {
    targetNode.style.opacity = '0';
    await sleep(50);
    targetNode.style.opacity = '1';
}
    listInput.value = '';
    await sleep(500);
    setListButtons(true);
}

    async function handleListDelete() {
    const value = parseInt(listInput.value);
    if (isNaN(value)) { alert("請輸入有效的數字！"); return; }
    setListButtons(false);
    let current = list.head, i = 0, foundNode = null;
    while(current) {
    const nodeEl = document.getElementById(`list-node-${i}`);
    if (nodeEl) nodeEl.classList.add('node-highlight');
    await sleep(400);
    if(current.value === value) { foundNode = nodeEl; break; }
    if (nodeEl) nodeEl.classList.remove('node-highlight');
    current = current.next; i++;
}
    if(foundNode) {
    foundNode.classList.add('node-deleting');
    await sleep(500);
    list.delete(value);
    await drawList();
} else {
    alert("在串列中找不到該數值！"); await drawList();
}
    listInput.value = '';
    setListButtons(true);
}

    function setListButtons(enabled) {
    addHeadBtn.disabled = !enabled; addTailBtn.disabled = !enabled;
    deleteBtn.disabled = !enabled; listResetBtn.disabled = !enabled;
}
    addHeadBtn.addEventListener('click', () => handleListAdd(true));
    addTailBtn.addEventListener('click', () => handleListAdd(false));
    deleteBtn.addEventListener('click', handleListDelete);
    listResetBtn.addEventListener('click', generateInitialList);

    // --- 陣列 (Array) ---
    const arraySvg = document.getElementById('array-svg');
    const arraySvgContainer = document.getElementById('array-container');
    const arrayValueInput = document.getElementById('array-value-input');
    const arrayIndexInput = document.getElementById('array-index-input');
    const arrayInsertBtn = document.getElementById('array-insert-btn');
    const arrayDeleteBtn = document.getElementById('array-delete-btn');
    const arrayResetBtn = document.getElementById('array-reset-btn');
    let arrayData = [];
    const MAX_ARRAY_SIZE = 12;

    function drawArray() {
    if(!arraySvg) return;
    arraySvg.innerHTML = '';
    const containerWidth = arraySvgContainer.clientWidth;
    const containerHeight = arraySvgContainer.clientHeight;
    let boxWidth = 70;
    const boxHeight = 70;

    const requiredWidth = arrayData.length * boxWidth;
    if(arrayData.length > 0 && requiredWidth > containerWidth - 40) {
    boxWidth = (containerWidth - 40) / arrayData.length;
}

    const totalWidth = arrayData.length * boxWidth;
    const startX = (containerWidth - totalWidth) / 2;
    const startY = containerHeight / 2 - boxHeight / 2;

    arrayData.forEach((value, i) => {
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${startX + i * boxWidth}, ${startY})`, id: `array-node-${i}` });
    const rect = createSvgElement('rect', { class:'node-rect', width: boxWidth - 4, height: boxHeight, rx: 8 });
    const text = createSvgElement('text', { class:'node-text', 'font-size': `${Math.max(12, 24 * (boxWidth/70))}px`, x: (boxWidth-4) / 2, y: boxHeight / 2 + 8, 'text-anchor': 'middle', content: value === null ? '' : value });
    const indexText = createSvgElement('text', { class: 'array-index-text', x: (boxWidth - 4) / 2, y: boxHeight + 20, 'text-anchor': 'middle', content: i });
    g.append(rect, text, indexText);
    arraySvg.appendChild(g);
});
    const defs = createSvgElement('defs', {});
    defs.innerHTML = `<filter id="shatter-filter"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.4" numOctaves="1" result="turbulence"/><feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    arraySvg.insertBefore(defs, arraySvg.firstChild);
}

    function generateInitialArray() {
    arrayData = [10, 25, 5, 8, 30];
    drawArray();
}

    async function handleArrayInsert() {
    const value = parseInt(arrayValueInput.value);
    const index = parseInt(arrayIndexInput.value);
    if(isNaN(value) || isNaN(index)) { alert("請輸入有效的數值和索引！"); return; }
    if(index < 0 || index > arrayData.length) { alert("索引超出範圍！"); return; }
    if(arrayData.length >= MAX_ARRAY_SIZE) { alert("陣列已滿，請先刪除元素！"); return; }

    setArrayButtons(false);

    let boxWidth = 70;
    const requiredWidth = (arrayData.length + 1) * boxWidth;
    if((arrayData.length + 1) > 0 && requiredWidth > arraySvgContainer.clientWidth - 40) {
    boxWidth = (arraySvgContainer.clientWidth - 40) / (arrayData.length + 1);
}

    for (let i = arrayData.length - 1; i >= index; i--) {
    const nodeToShift = document.getElementById(`array-node-${i}`);
    if(nodeToShift) {
    const currentTransform = nodeToShift.getAttribute('transform');
    const x = parseFloat(/translate\(([^,]+),/.exec(currentTransform)[1]);
    nodeToShift.setAttribute('transform', `translate(${x + boxWidth}, ${/translate\([^,]+,([^)]+)\)/.exec(currentTransform)[1]})`);
}
}
    await sleep(500);

    arrayData.splice(index, 0, value);
    drawArray();

    const newNode = document.getElementById(`array-node-${index}`);
    if (newNode) {
    newNode.style.opacity = '0';
    await sleep(50);
    newNode.style.opacity = '1';
    newNode.classList.add('node-highlight');
    await sleep(500);
    newNode.classList.remove('node-highlight');
}

    arrayValueInput.value = ''; arrayIndexInput.value = '';
    setArrayButtons(true);
}

    async function handleArrayDelete() {
    const index = parseInt(arrayIndexInput.value);
    if (isNaN(index)) { alert("請輸入有效的索引！"); return; }
    if (index < 0 || index >= arrayData.length) { alert("索引超出範圍！"); return; }

    setArrayButtons(false);
    const nodeToDelete = document.getElementById(`array-node-${index}`);
    if (nodeToDelete) {
    nodeToDelete.classList.add('node-deleting');
    await sleep(500);
}

    let boxWidth = 70;
    const requiredWidth = (arrayData.length - 1) * boxWidth;
    if((arrayData.length - 1) > 0 && requiredWidth > arraySvgContainer.clientWidth - 40) {
    boxWidth = (arraySvgContainer.clientWidth - 40) / (arrayData.length - 1);
}

    arrayData.splice(index, 1);

    drawArray();

    for (let i = index; i < arrayData.length; i++) {
    const nodeToShift = document.getElementById(`array-node-${i}`);
    if(nodeToShift) {
    const finalTransform = nodeToShift.getAttribute('transform');
    const finalX = parseFloat(/translate\(([^,]+),/.exec(finalTransform)[1]);
    nodeToShift.setAttribute('transform', `translate(${finalX + boxWidth}, ${/translate\([^,]+,([^)]+)\)/.exec(finalTransform)[1]})`);
    await sleep(50);
    nodeToShift.setAttribute('transform', `translate(${finalX}, ${/translate\([^,]+,([^)]+)\)/.exec(finalTransform)[1]})`);
}
}

    arrayIndexInput.value = '';
    await sleep(500);
    setArrayButtons(true);
}

    function setArrayButtons(enabled) {
    arrayInsertBtn.disabled = !enabled;
    arrayDeleteBtn.disabled = !enabled;
    arrayResetBtn.disabled = !enabled;
}

    arrayInsertBtn.addEventListener('click', handleArrayInsert);
    arrayDeleteBtn.addEventListener('click', handleArrayDelete);
    arrayResetBtn.addEventListener('click', generateInitialArray);

    // --- 堆疊 (Stack) ---
    const stackSvg = document.getElementById('stack-svg');
    const stackSvgContainer = document.getElementById('stack-container');
    const stackValueInput = document.getElementById('stack-value-input');
    const stackPushBtn = document.getElementById('stack-push-btn');
    const stackPopBtn = document.getElementById('stack-pop-btn');
    const stackResetBtn = document.getElementById('stack-reset-btn');
    let stackData = [];
    const MAX_STACK_SIZE = 8;

    function drawStack() {
    if(!stackSvg) return;
    stackSvg.innerHTML = '';
    const containerWidth = stackSvgContainer.clientWidth;
    const containerHeight = stackSvgContainer.clientHeight;
    const boxWidth = 100, boxHeight = 40;
    const startX = containerWidth / 2 - boxWidth / 2;

    stackData.forEach((value, i) => {
    const y = containerHeight - (i + 1) * boxHeight - 20;
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${startX}, ${y})`, id: `stack-node-${i}`});
    const rect = createSvgElement('rect', { class: 'node-rect', width: boxWidth, height: boxHeight, rx: 8});
    const text = createSvgElement('text', { class: 'node-text', 'font-size': '18px', x: boxWidth / 2, y: boxHeight / 2 + 8, 'text-anchor': 'middle', content: value });
    g.append(rect, text);
    stackSvg.appendChild(g);
});

    if(stackData.length > 0) {
    const topY = containerHeight - stackData.length * boxHeight - 20;
    const topPointer = createSvgElement('line', { x1: startX - 60, y1: topY + boxHeight/2, x2: startX, y2: topY + boxHeight/2, class: 'stack-pointer', 'marker-end': 'url(#arrow)'});
    const topLabel = createSvgElement('text', { x: startX - 70, y: topY + boxHeight/2 + 5, class: 'node-label', 'text-anchor': 'end', content: 'TOP'});
    stackSvg.append(topPointer, topLabel);
}

    const defs = createSvgElement('defs', {});
    defs.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34495e" /></marker><filter id="shatter-filter"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.4" numOctaves="1" result="turbulence"/><feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    stackSvg.insertBefore(defs, stackSvg.firstChild);
}

    function generateInitialStack() {
    stackData = [10, 25, 5];
    drawStack();
}

    async function handleStackPush() {
    const value = parseInt(stackValueInput.value);
    if(isNaN(value)) { alert("請輸入有效的數值！"); return; }
    if(stackData.length >= MAX_STACK_SIZE) { alert("堆疊已滿！"); return; }

    setStackButtons(false);

    stackData.push(value);
    drawStack();

    const newNode = document.getElementById(`stack-node-${stackData.length - 1}`);
    if(newNode) {
    const finalTransform = newNode.getAttribute('transform');
    newNode.setAttribute('transform', `translate(${/translate\(([^,]+),/.exec(finalTransform)[1]}, -50)`);
    newNode.style.opacity = '0';
    await sleep(50);
    newNode.setAttribute('transform', finalTransform);
    newNode.style.opacity = '1';
}

    stackValueInput.value = '';
    await sleep(500);
    setStackButtons(true);
}

    async function handleStackPop() {
    if(stackData.length === 0) { alert("堆疊是空的！"); return; }
    setStackButtons(false);

    const topNode = document.getElementById(`stack-node-${stackData.length - 1}`);
    if(topNode) {
    const finalTransform = topNode.getAttribute('transform');
    topNode.setAttribute('transform', `translate(${/translate\(([^,]+),/.exec(finalTransform)[1]}, -50)`);
    topNode.style.opacity = '0';
}

    await sleep(500);
    stackData.pop();
    drawStack();
    setStackButtons(true);
}

    function setStackButtons(enabled) {
    stackPushBtn.disabled = !enabled;
    stackPopBtn.disabled = !enabled;
    stackResetBtn.disabled = !enabled;
}

    stackPushBtn.addEventListener('click', handleStackPush);
    stackPopBtn.addEventListener('click', handleStackPop);
    stackResetBtn.addEventListener('click', generateInitialStack);

    // --- 佇列 (Queue) ---
    const queueSvg = document.getElementById('queue-svg');
    const queueSvgContainer = document.getElementById('queue-container');
    const queueValueInput = document.getElementById('queue-value-input');
    const queueEnqueueBtn = document.getElementById('queue-enqueue-btn');
    const queueDequeueBtn = document.getElementById('queue-dequeue-btn');
    const queueResetBtn = document.getElementById('queue-reset-btn');
    let queueData = [];
    const MAX_QUEUE_SIZE = 10;

    function drawQueue() {
    if(!queueSvg) return;
    queueSvg.innerHTML = '';
    const containerWidth = queueSvgContainer.clientWidth;
    const containerHeight = queueSvgContainer.clientHeight;
    let boxWidth = 80, boxHeight = 50;
    const gap = 10;

    const requiredWidth = queueData.length * (boxWidth + gap);
    if (queueData.length > 0 && requiredWidth > containerWidth - 160) {
    boxWidth = (containerWidth - 160) / queueData.length - gap;
}

    const totalWidth = queueData.length * (boxWidth + gap);
    const startX = (containerWidth - totalWidth) / 2;
    const startY = containerHeight / 2 - boxHeight / 2;

    queueData.forEach((value, i) => {
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${startX + i * (boxWidth + gap)}, ${startY})`, id: `queue-node-${i}`});
    const rect = createSvgElement('rect', { class: 'node-rect', width: boxWidth, height: boxHeight, rx: 8});
    const text = createSvgElement('text', { class: 'node-text', 'font-size': '18px', x: boxWidth/2, y: boxHeight/2 + 8, 'text-anchor':'middle', content: value });
    g.append(rect, text);
    queueSvg.appendChild(g);
});

    if (queueData.length > 0) {
    const frontX = startX + boxWidth/2;
    const rearX = startX + (queueData.length - 1) * (boxWidth + gap) + boxWidth/2;
    const pointerY = startY + boxHeight + 30;

    const frontLabel = createSvgElement('text', { x: frontX, y: pointerY, class:'node-label', 'text-anchor':'middle', content: 'FRONT' });
    const frontPointer = createSvgElement('line', { x1: frontX, y1: pointerY - 10, x2: frontX, y2: startY + boxHeight, class:'queue-pointer', 'marker-end': 'url(#arrow)'});

    const rearLabel = createSvgElement('text', { x: rearX, y: pointerY, class:'node-label', 'text-anchor':'middle', content: 'REAR'});
    const rearPointer = createSvgElement('line', { x1: rearX, y1: pointerY - 10, x2: rearX, y2: startY + boxHeight, class:'queue-pointer', 'marker-end': 'url(#arrow)'});

    queueSvg.append(frontLabel, frontPointer, rearLabel, rearPointer);
}

    const defs = createSvgElement('defs', {});
    defs.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34495e" /></marker><filter id="shatter-filter"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.4" numOctaves="1" result="turbulence"/><feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    queueSvg.insertBefore(defs, queueSvg.firstChild);
}

    function generateInitialQueue() {
    queueData = [10, 25, 5];
    drawQueue();
}

    async function handleQueueEnqueue() {
    const value = parseInt(queueValueInput.value);
    if(isNaN(value)) { alert("請輸入有效的數值！"); return; }
    if (queueData.length >= MAX_QUEUE_SIZE) { alert("佇列已滿！"); return; }

    setQueueButtons(false);
    queueData.push(value);
    drawQueue();

    const newNode = document.getElementById(`queue-node-${queueData.length - 1}`);
    if(newNode) {
    const finalTransform = newNode.getAttribute('transform');
    const x = parseFloat(/translate\(([^,]+),/.exec(finalTransform)[1]);
    newNode.setAttribute('transform', `translate(${x + 100}, ${/translate\([^,]+,([^)]+)\)/.exec(finalTransform)[1]})`);
    newNode.style.opacity = '0';
    await sleep(50);
    newNode.setAttribute('transform', finalTransform);
    newNode.style.opacity = '1';
}
    queueValueInput.value = '';
    await sleep(500);
    setQueueButtons(true);
}

    async function handleQueueDequeue() {
    if (queueData.length === 0) { alert("佇列是空的！"); return; }
    setQueueButtons(false);

    const frontNode = document.getElementById('queue-node-0');
    if (frontNode) {
    const finalTransform = frontNode.getAttribute('transform');
    const x = parseFloat(/translate\(([^,]+),/.exec(finalTransform)[1]);
    frontNode.setAttribute('transform', `translate(${x - 100}, ${/translate\([^,]+,([^)]+)\)/.exec(finalTransform)[1]})`);
    frontNode.style.opacity = '0';
}
    await sleep(500);

    queueData.shift();
    drawQueue();
    setQueueButtons(true);
}

    function setQueueButtons(enabled) {
    queueEnqueueBtn.disabled = !enabled;
    queueDequeueBtn.disabled = !enabled;
    queueResetBtn.disabled = !enabled;
}

    queueEnqueueBtn.addEventListener('click', handleQueueEnqueue);
    queueDequeueBtn.addEventListener('click', handleQueueDequeue);
    queueResetBtn.addEventListener('click', generateInitialQueue);

    // --- 雜湊表 (Hash Table) ---
    const hashTableSvg = document.getElementById('hash-table-svg');
    const hashTableSvgContainer = document.getElementById('hash-table-container');
    const hashKeyInput = document.getElementById('hash-key-input');
    const hashValueInput = document.getElementById('hash-value-input');
    const hashInsertBtn = document.getElementById('hash-insert-btn');
    const hashDeleteBtn = document.getElementById('hash-delete-btn');
    const hashSearchBtn = document.getElementById('hash-search-btn');
    const hashResetBtn = document.getElementById('hash-reset-btn');

    const HASH_TABLE_SIZE = 10;
    let hashTable = Array.from({ length: HASH_TABLE_SIZE }, () => new LinkedList());

    function simpleHash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
}
    return hash % HASH_TABLE_SIZE;
}

    function drawHashTable() {
    if(!hashTableSvg) return;
    hashTableSvg.innerHTML = '';
    const bucketWidth = hashTableSvg.clientWidth / HASH_TABLE_SIZE;
    const bucketHeight = hashTableSvg.clientHeight;

    for(let i=0; i<HASH_TABLE_SIZE; i++) {
    const bucket = createSvgElement('rect', { x: i * bucketWidth, y: 0, width: bucketWidth - 1, height: bucketHeight, fill: '#f8f9fa', stroke: '#e9ecef', 'stroke-width': 1, id: `hash-bucket-${i}`, class: 'hash-bucket' });
    const indexText = createSvgElement('text', { x: i * bucketWidth + 10, y: 20, class: 'hash-index-text', content: i });
    hashTableSvg.append(bucket, indexText);

    let current = hashTable[i].head;
    let j = 0;
    while (current) {
    const nodeWidth = bucketWidth * 0.8;
    const nodeHeight = 40;
    const nodeX = i * bucketWidth + (bucketWidth - nodeWidth) / 2;
    const nodeY = 40 + j * (nodeHeight + 15);

    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${nodeX}, ${nodeY})`, id: `hash-node-${i}-${j}` });
    const rect = createSvgElement('rect', { class: 'node-rect', width: nodeWidth, height: nodeHeight, rx: 5 });
    const keyText = createSvgElement('text', { class: 'hash-key-text', x: nodeWidth / 2, y: nodeHeight / 2 - 5, 'text-anchor': 'middle', content: `K: ${current.value.key}` });
    const valueText = createSvgElement('text', { class: 'node-text', 'font-size': '14px', x: nodeWidth / 2, y: nodeHeight / 2 + 15, 'text-anchor': 'middle', content: `V: ${current.value.value}` });
    g.append(rect, keyText, valueText);
    hashTableSvg.appendChild(g);

    if (current.next) {
    const pointer = createSvgElement('line', { x1: nodeX + nodeWidth / 2, y1: nodeY + nodeHeight, x2: nodeX + nodeWidth / 2, y2: nodeY + nodeHeight + 15, class: 'hash-pointer', 'marker-end': 'url(#arrow)' });
    hashTableSvg.appendChild(pointer);
}
    current = current.next; j++;
}
}
    const defs = createSvgElement('defs', {});
    defs.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34495e" /></marker><filter id="shatter-filter"><feTurbulence type="fractalNoise" baseFrequency="0.1 0.4" numOctaves="1" result="turbulence"/><feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    hashTableSvg.insertBefore(defs, hashTableSvg.firstChild);
}

    function generateInitialHashTable() {
    hashTable = Array.from({ length: HASH_TABLE_SIZE }, () => new LinkedList());
    const initialData = [{key: 'apple', value: 5}, {key: 'banana', value: 8}, {key: 'cherry', value: 12}, {key: 'date', value: 1}];
    initialData.forEach(item => {
    const index = simpleHash(item.key);
    hashTable[index].addToTail(item);
});
    drawHashTable();
}

    async function handleHashAction(action) {
    const key = hashKeyInput.value;
    const value = hashValueInput.value;
    if(!key) { alert("請輸入鍵 (Key)！"); return; }
    if(action === 'insert' && !value) { alert("請輸入值 (Value)！"); return; }

    setHashButtons(false);
    const index = simpleHash(key);

    const bucketEl = document.getElementById(`hash-bucket-${index}`);
    if(bucketEl) bucketEl.classList.add('hash-bucket-highlight');
    await sleep(800);

    let list = hashTable[index];
    let current = list.head;
    let nodeToUpdate = null;
    let i = 0;

    while(current){
    if(current.value.key === key) {
    nodeToUpdate = document.getElementById(`hash-node-${index}-${i}`);
    break;
}
    current = current.next;
    i++;
}

    if (action === 'insert') {
    if(nodeToUpdate) {
    current.value.value = value;
} else {
    list.addToTail({key, value});
}
} else if (action === 'delete') {
    if(nodeToUpdate) {
    nodeToUpdate.classList.add('node-deleting');
    await sleep(500);
    list.delete({key, value: current.value.value});
} else {
    alert("找不到要刪除的鍵！");
}
} else if (action === 'search') {
    if(!nodeToUpdate) {
    alert("找不到指定的鍵！");
}
}

    drawHashTable();

    if (action !== 'delete' && nodeToUpdate) {
    let current = list.head; let i = 0;
    while(current) {
    if(current.value.key === key) {
    document.getElementById(`hash-node-${index}-${i}`).classList.add('node-highlight');
    break;
}
    current = current.next; i++;
}
}

    await sleep(1000);
    if(bucketEl) bucketEl.classList.remove('hash-bucket-highlight');
    const finalNode = document.querySelector('.node-highlight');
    if(finalNode) finalNode.classList.remove('node-highlight');

    hashKeyInput.value = '';
    hashValueInput.value = '';
    setHashButtons(true);
}

    LinkedList.prototype.delete = function(obj) {
    if (!this.head) return false;
    if (this.head.value.key === obj.key) { this.head = this.head.next; this.size--; return true; }
    let current = this.head;
    while (current.next && current.next.value.key !== obj.key) { current = current.next; }
    if (current.next) { current.next = current.next.next; this.size--; return true; }
    return false;
}

    function setHashButtons(enabled) {
    hashInsertBtn.disabled = !enabled;
    hashDeleteBtn.disabled = !enabled;
    hashSearchBtn.disabled = !enabled;
    hashResetBtn.disabled = !enabled;
}

    hashInsertBtn.addEventListener('click', () => handleHashAction('insert'));
    hashDeleteBtn.addEventListener('click', () => handleHashAction('delete'));
    hashSearchBtn.addEventListener('click', () => handleHashAction('search'));
    hashResetBtn.addEventListener('click', generateInitialHashTable);

    // --- 堆積 (Heap) ---
    const heapSvg = document.getElementById('heap-svg');
    const heapSvgContainer = document.getElementById('heap-container');
    const heapValueInput = document.getElementById('heap-value-input');
    const heapInsertBtn = document.getElementById('heap-insert-btn');
    const heapExtractBtn = document.getElementById('heap-extract-btn');
    const heapResetBtn = document.getElementById('heap-reset-btn');

    class MaxHeap {
    constructor() { this.heap = []; }
    insert(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
}
    extractMax() {
    if (this.heap.length === 0) return null;
    this.swap(0, this.heap.length - 1);
    const max = this.heap.pop();
    this.bubbleDown(0);
    return max;
}
    bubbleUp(index) {
    while (index > 0) {
    let parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[parentIndex] < this.heap[index]) {
    this.swap(parentIndex, index);
    index = parentIndex;
} else {
    break;
}
}
}
    bubbleDown(index) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let largest = index;

    if (leftChild < this.heap.length && this.heap[leftChild] > this.heap[largest]) {
    largest = leftChild;
}
    if (rightChild < this.heap.length && this.heap[rightChild] > this.heap[largest]) {
    largest = rightChild;
}
    if (largest !== index) {
    this.swap(index, largest);
    this.bubbleDown(largest);
}
}
    swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
}
}
    const heap = new MaxHeap();

    function getHeapNodePositions() {
    const positions = [];
    const containerWidth = heapSvgContainer.clientWidth;
    const containerHeight = heapSvgContainer.clientHeight;
    const levels = Math.floor(Math.log2(heap.heap.length)) + 1;

    for (let i = 0; i < heap.heap.length; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const indexInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const x = (containerWidth / (nodesInLevel + 1)) * (indexInLevel + 1);
    const y = (containerHeight / (levels + 1)) * (level + 1);
    positions.push({ x, y });
}
    return positions;
}

    function drawHeap() {
    if(!heapSvg) return;
    heapSvg.innerHTML = '';
    const positions = getHeapNodePositions();
    const radius = 25;

    // Draw links
    for (let i = 0; i < heap.heap.length; i++) {
    const leftChildIndex = 2 * i + 1;
    const rightChildIndex = 2 * i + 2;
    if (leftChildIndex < heap.heap.length) {
    const link = createSvgElement('line', { x1: positions[i].x, y1: positions[i].y, x2: positions[leftChildIndex].x, y2: positions[leftChildIndex].y, class: 'heap-link' });
    heapSvg.appendChild(link);
}
    if (rightChildIndex < heap.heap.length) {
    const link = createSvgElement('line', { x1: positions[i].x, y1: positions[i].y, x2: positions[rightChildIndex].x, y2: positions[rightChildIndex].y, class: 'heap-link' });
    heapSvg.appendChild(link);
}
}

    // Draw nodes
    for (let i = 0; i < heap.heap.length; i++) {
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${positions[i].x}, ${positions[i].y})`, id: `heap-node-${i}` });
    const circle = createSvgElement('circle', { r: radius, class: 'node-rect' });
    const text = createSvgElement('text', { class: 'node-text', 'font-size': '18px', 'text-anchor': 'middle', 'dominant-baseline': 'middle', content: heap.heap[i] });
    g.append(circle, text);
    heapSvg.appendChild(g);
}
}

    function generateInitialHeap() {
    heap.heap = [];
    [100, 19, 36, 17, 3, 25, 1, 2, 7].forEach(val => heap.insert(val));
    drawHeap();
}

    async function handleHeapInsert() {
    const value = parseInt(heapValueInput.value);
    if (isNaN(value)) { alert("請輸入有效的數值！"); return; }
    setHeapButtons(false);

    heap.heap.push(value);
    let currentIndex = heap.heap.length - 1;
    drawHeap();

    while (currentIndex > 0) {
    let parentIndex = Math.floor((currentIndex - 1) / 2);
    const currentNodeEl = document.getElementById(`heap-node-${currentIndex}`);
    const parentNodeEl = document.getElementById(`heap-node-${parentIndex}`);

    if (heap.heap[parentIndex] < heap.heap[currentIndex]) {
    if (currentNodeEl) currentNodeEl.classList.add('node-highlight');
    if (parentNodeEl) parentNodeEl.classList.add('node-highlight');
    await sleep(800);

    heap.swap(parentIndex, currentIndex);
    drawHeap();
    document.getElementById(`heap-node-${parentIndex}`).classList.add('node-highlight');
    await sleep(800);

    currentIndex = parentIndex;
} else {
    break;
}
}
    drawHeap();
    heapValueInput.value = '';
    setHeapButtons(true);
}

    async function handleHeapExtract() {
    if (heap.heap.length === 0) { alert("堆積是空的！"); return; }
    setHeapButtons(false);

    const lastIndex = heap.heap.length - 1;
    const rootNode = document.getElementById(`heap-node-0`);
    const lastNode = document.getElementById(`heap-node-${lastIndex}`);

    if (rootNode && lastNode && heap.heap.length > 1) {
    rootNode.classList.add('node-highlight');
    lastNode.classList.add('node-highlight');
    await sleep(800);
}

    heap.swap(0, lastIndex);
    const max = heap.heap.pop();
    drawHeap();

    if (rootNode) rootNode.classList.add('node-deleting');
    await sleep(500);
    drawHeap();

    let currentIndex = 0;
    while(true) {
    const leftChild = 2 * currentIndex + 1;
    const rightChild = 2 * currentIndex + 2;
    let largest = currentIndex;

    if (leftChild < heap.heap.length && heap.heap[leftChild] > heap.heap[largest]) {
    largest = leftChild;
}
    if (rightChild < heap.heap.length && heap.heap[rightChild] > heap.heap[largest]) {
    largest = rightChild;
}
    if (largest !== currentIndex) {
    const currentNodeEl = document.getElementById(`heap-node-${currentIndex}`);
    const largestNodeEl = document.getElementById(`heap-node-${largest}`);
    if (currentNodeEl) currentNodeEl.classList.add('node-highlight');
    if (largestNodeEl) largestNodeEl.classList.add('node-highlight');
    await sleep(800);

    heap.swap(currentIndex, largest);
    drawHeap();
    document.getElementById(`heap-node-${largest}`).classList.add('node-highlight');
    await sleep(800);

    currentIndex = largest;
} else {
    break;
}
}
    drawHeap();
    setHeapButtons(true);
}

    function setHeapButtons(enabled) {
    heapInsertBtn.disabled = !enabled;
    heapExtractBtn.disabled = !enabled;
    heapResetBtn.disabled = !enabled;
}

    heapInsertBtn.addEventListener('click', handleHeapInsert);
    heapExtractBtn.addEventListener('click', handleHeapExtract);
    heapResetBtn.addEventListener('click', generateInitialHeap);

    // --- 二元搜尋樹 (BST) ---
    const bstSvg = document.getElementById('bst-svg');
    const bstSvgContainer = document.getElementById('bst-container');
    const bstValueInput = document.getElementById('bst-value-input');
    const bstInsertBtn = document.getElementById('bst-insert-btn');
    const bstDeleteBtn = document.getElementById('bst-delete-btn');
    const bstSearchBtn = document.getElementById('bst-search-btn');
    const bstResetBtn = document.getElementById('bst-reset-btn');

    class BSTNode {
    constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
    this.id = `bst-node-${value}`;
}
}

    class BinarySearchTree {
    constructor() { this.root = null; }
    insert(value) {
    const newNode = new BSTNode(value);
    if (this.root === null) {
    this.root = newNode; return true;
}
    let current = this.root;
    while (true) {
    if (value === current.value) return false;
    if (value < current.value) {
    if (current.left === null) { current.left = newNode; return true; }
    current = current.left;
} else {
    if (current.right === null) { current.right = newNode; return true; }
    current = current.right;
}
}
}
    search(value) {
    if(this.root === null) return null;
    let current = this.root;
    while(current && current.value !== value) {
    if(value < current.value) current = current.left;
    else current = current.right;
}
    return current;
}
    delete(value) { this.root = this.deleteNode(this.root, value); }
    deleteNode(node, value) {
    if (node === null) return null;
    if (value < node.value) {
    node.left = this.deleteNode(node.left, value);
    return node;
} else if (value > node.value) {
    node.right = this.deleteNode(node.right, value);
    return node;
} else {
    if (node.left === null && node.right === null) return null;
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;
    let tempNode = this.findMinNode(node.right);
    node.value = tempNode.value;
    node.id = `bst-node-${node.value}`;
    node.right = this.deleteNode(node.right, tempNode.value);
    return node;
}
}
    findMinNode(node) {
    while(node.left !== null) node = node.left;
    return node;
}
}

    const bst = new BinarySearchTree();

    function drawBST() {
    if(!bstSvg) return;
    bstSvg.innerHTML = '';
    const containerWidth = bstSvgContainer.clientWidth;
    const containerHeight = bstSvgContainer.clientHeight;
    const radius = 25;

    function assignPositions(node, x, y, horizontalOffset) {
    if (node === null) return;
    node.x = x;
    node.y = y;
    assignPositions(node.left, x - horizontalOffset, y + 70, horizontalOffset / 2);
    assignPositions(node.right, x + horizontalOffset, y + 70, horizontalOffset / 2);
}

    function drawNodeAndLink(node) {
    if(node === null) return;
    if (node.left) {
    const link = createSvgElement('line', { x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y, class: 'bst-link'});
    bstSvg.appendChild(link);
}
    if (node.right) {
    const link = createSvgElement('line', { x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y, class: 'bst-link'});
    bstSvg.appendChild(link);
}
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${node.x}, ${node.y})`, id: node.id });
    const circle = createSvgElement('circle', { r: radius, class: 'node-rect' });
    const text = createSvgElement('text', { class: 'node-text', 'font-size': '18px', 'text-anchor': 'middle', 'dominant-baseline': 'middle', content: node.value });
    g.append(circle, text);
    bstSvg.appendChild(g);
    drawNodeAndLink(node.left);
    drawNodeAndLink(node.right);
}

    if(bst.root) {
    assignPositions(bst.root, containerWidth / 2, 50, containerWidth / 4);
    drawNodeAndLink(bst.root);
}
}

    function generateInitialBST() {
    bst.root = null;
    [50, 30, 70, 20, 40, 60, 80].forEach(val => bst.insert(val));
    drawBST();
}

    async function handleBSTAction(action) {
    const value = parseInt(bstValueInput.value);
    if(isNaN(value)) { alert("請輸入有效的數值！"); return; }
    setBstButtons(false);

    let current = bst.root;
    let path = [];
    while(current) {
    path.push(current);
    if(value === current.value) break;
    else if (value < current.value) current = current.left;
    else current = current.right;
}

    for(let i = 0; i < path.length; i++) {
    const node = path[i];
    const nodeEl = document.getElementById(node.id);
    if(nodeEl) nodeEl.classList.add('node-highlight');
    await sleep(500);
    if(i < path.length - 1) {
    if(nodeEl) nodeEl.classList.remove('node-highlight');
}
}

    const foundNodeEl = current ? document.getElementById(current.id) : null;
    if(action === 'insert') {
    if(foundNodeEl) {
    alert("樹中已存在相同數值！");
} else {
    bst.insert(value);
    drawBST();
}
} else if (action === 'search') {
    if(!foundNodeEl) alert("找不到指定的數值！");
} else if (action === 'delete') {
    if(!foundNodeEl) {
    alert("找不到要刪除的數值！");
} else {
    foundNodeEl.classList.add('node-deleting');
    await sleep(500);
    bst.delete(value);
    drawBST();
}
}

    await sleep(1000);
    document.querySelectorAll('.node-highlight').forEach(el => el.classList.remove('node-highlight'));
    bstValueInput.value = '';
    setBstButtons(true);
}

    function setBstButtons(enabled) {
    bstInsertBtn.disabled = !enabled;
    bstDeleteBtn.disabled = !enabled;
    bstSearchBtn.disabled = !enabled;
    bstResetBtn.disabled = !enabled;
}

    bstInsertBtn.addEventListener('click', () => handleBSTAction('insert'));
    bstDeleteBtn.addEventListener('click', () => handleBSTAction('delete'));
    bstSearchBtn.addEventListener('click', () => handleBSTAction('search'));
    bstResetBtn.addEventListener('click', generateInitialBST);

    // --- 廣度優先搜尋 (BFS) & 深度優先搜尋 (DFS) ---
    const bfsSvg = document.getElementById('bfs-svg');
    const dfsSvg = document.getElementById('dfs-svg');
    const bfsQueueDisplay = document.getElementById('bfs-queue-display');
    const bfsStartInput = document.getElementById('bfs-start-input');
    const bfsStartBtn = document.getElementById('bfs-start-btn');
    const bfsResetBtn = document.getElementById('bfs-reset-btn');
    const dfsStartInput = document.getElementById('dfs-start-input');
    const dfsStartBtn = document.getElementById('dfs-start-btn');
    const dfsResetBtn = document.getElementById('dfs-reset-btn');

    const graph = {
    'A': ['B', 'C'], 'B': ['D'], 'C': ['E', 'F'], 'D': ['E'],
    'E': ['A'], 'F': []
};
    const graphPositions = {};

    function drawGraph(svgEl, idPrefix) {
    if(!svgEl) return;
    svgEl.innerHTML = '';
    const nodeKeys = Object.keys(graph);
    const radius = 25;
    const containerWidth = svgEl.parentElement.clientWidth;
    const containerHeight = svgEl.parentElement.clientHeight;

    const angleStep = (2 * Math.PI) / nodeKeys.length;
    const graphRadius = Math.min(containerWidth, containerHeight) / 2 - 60;
    nodeKeys.forEach((key, i) => {
    graphPositions[key] = {
    x: containerWidth / 2 + graphRadius * Math.cos(angleStep * i - Math.PI / 2),
    y: containerHeight / 2 + graphRadius * Math.sin(angleStep * i - Math.PI / 2)
};
});

    const defs = createSvgElement('defs', {});
    defs.innerHTML = `<marker id="arrow-${idPrefix}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#34495e" /></marker>`;
    svgEl.appendChild(defs);

    for(const key in graph) {
    for(const neighbor of graph[key]) {
    const startPos = graphPositions[key];
    const endPos = graphPositions[neighbor];

    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / dist;
    const unitY = dy / dist;
    const targetX = endPos.x - unitX * radius;
    const targetY = endPos.y - unitY * radius;

    const link = createSvgElement('line', { x1: startPos.x, y1: startPos.y, x2: targetX, y2: targetY, class: `${idPrefix}-link`, 'marker-end': `url(#arrow-${idPrefix})` });
    svgEl.appendChild(link);
}
}

    for(const key in graphPositions) {
    const pos = graphPositions[key];
    const g = createSvgElement('g', { class: 'node-group', transform: `translate(${pos.x}, ${pos.y})`, id: `${idPrefix}-node-${key}`});
    const circle = createSvgElement('circle', { r: radius, class: 'node-rect' });
    const text = createSvgElement('text', { class: 'node-text', 'font-size': '18px', 'text-anchor': 'middle', 'dominant-baseline': 'middle', content: key });
    g.append(circle, text);
    svgEl.appendChild(g);
}
}

    async function handleBfs() {
    const startNodeKey = bfsStartInput.value.toUpperCase();
    if (!graph[startNodeKey]) { alert("請輸入有效的起始節點 (A-F)！"); return; }
    setBfsButtons(false);
    drawGraph(bfsSvg, 'bfs');

    const pathDot = createSvgElement('circle', { id: 'bfs-path-dot', r: 5 });
    bfsSvg.appendChild(pathDot);

    const queue = [startNodeKey];
    const visited = new Set([startNodeKey]);
    document.getElementById(`bfs-node-${startNodeKey}`).classList.add('graph-node-in-queue');
    pathDot.setAttribute('transform', `translate(${graphPositions[startNodeKey].x}, ${graphPositions[startNodeKey].y})`);
    bfsQueueDisplay.textContent = `佇列: [${queue.join(', ')}]`;
    await sleep(500);

    while (queue.length > 0) {
    const currentNodeKey = queue.shift();
    bfsQueueDisplay.textContent = `佇列: [${queue.join(', ')}]`;

    const currentNodeEl = document.getElementById(`bfs-node-${currentNodeKey}`);
    currentNodeEl.classList.remove('graph-node-in-queue');
    currentNodeEl.classList.add('node-highlight');

    pathDot.setAttribute('transform', `translate(${graphPositions[currentNodeKey].x}, ${graphPositions[currentNodeKey].y})`);
    await sleep(800);

    for(const neighborKey of graph[currentNodeKey]) {
    if (!visited.has(neighborKey)) {
    visited.add(neighborKey);
    queue.push(neighborKey);
    document.getElementById(`bfs-node-${neighborKey}`).classList.add('graph-node-in-queue');
    pathDot.setAttribute('transform', `translate(${graphPositions[neighborKey].x}, ${graphPositions[neighborKey].y})`);
    bfsQueueDisplay.textContent = `佇列: [${queue.join(', ')}]`;
    await sleep(500);
}
}
    currentNodeEl.classList.remove('node-highlight');
    currentNodeEl.classList.add('graph-node-visited');
}
    bfsQueueDisplay.textContent = '佇列: [] (完成)';
    pathDot.remove();
    setBfsButtons(true);
}

    function setBfsButtons(enabled) {
    bfsStartBtn.disabled = !enabled;
    bfsResetBtn.disabled = !enabled;
}

    bfsStartBtn.addEventListener('click', handleBfs);
    bfsResetBtn.addEventListener('click', () => drawGraph(bfsSvg, 'bfs'));

    async function handleDfs() {
    const startNode = dfsStartInput.value.toUpperCase();
    if (!graph[startNode]) { alert("請輸入有效的起始節點 (A-F)！"); return; }
    setDfsButtons(false);
    drawGraph(dfsSvg, 'dfs');
    const visited = new Set();

    const pathDot = createSvgElement('circle', { id: 'dfs-path-dot', r: 5 });
    dfsSvg.appendChild(pathDot);

    await dfsRecursive(startNode, visited, pathDot);

    pathDot.remove();
    setDfsButtons(true);
}

    async function dfsRecursive(nodeKey, visited, pathDot) {
    visited.add(nodeKey);
    pathDot.setAttribute('transform', `translate(${graphPositions[nodeKey].x}, ${graphPositions[nodeKey].y})`);
    const nodeEl = document.getElementById(`dfs-node-${nodeKey}`);
    if (nodeEl) nodeEl.classList.add('node-highlight');
    await sleep(800);

    for (const neighborKey of graph[nodeKey]) {
    if (!visited.has(neighborKey)) {
    await dfsRecursive(neighborKey, visited, pathDot);
    pathDot.setAttribute('transform', `translate(${graphPositions[nodeKey].x}, ${graphPositions[nodeKey].y})`);
    if (nodeEl) nodeEl.classList.add('node-highlight');
    await sleep(500);
}
}
    if (nodeEl) {
    nodeEl.classList.remove('node-highlight');
    nodeEl.classList.add('graph-node-visited');
}
}

    function setDfsButtons(enabled) {
    dfsStartBtn.disabled = !enabled;
    dfsResetBtn.disabled = !enabled;
}
    dfsStartBtn.addEventListener('click', handleDfs);
    dfsResetBtn.addEventListener('click', () => drawGraph(dfsSvg, 'dfs'));

    // --- Diffie-Hellman ---
    const dhContainer = document.getElementById('dh-container');
    const dhLog = document.getElementById('dh-log-wrapper');
    const dhAliceSecretEl = document.getElementById('dh-alice-secret');
    const dhAlicePublicEl = document.getElementById('dh-alice-public');
    const dhAliceSharedEl = document.getElementById('dh-alice-shared');
    const dhBobSecretEl = document.getElementById('dh-bob-secret');
    const dhBobPublicEl = document.getElementById('dh-bob-public');
    const dhBobSharedEl = document.getElementById('dh-bob-shared');
    const dhPublicKeyEl = document.getElementById('dh-public-key');
    const dhStartBtn = document.getElementById('dh-start-btn');
    const dhResetBtn = document.getElementById('dh-reset-btn');

    function generateInitialDh() {
    dhLog.innerHTML = `<p>1. 雙方（A 和 B）首先同意並知道一個公開的金鑰 P。</p>`;
    [dhAliceSecretEl, dhAlicePublicEl, dhAliceSharedEl, dhBobSecretEl, dhBobPublicEl, dhBobSharedEl, dhPublicKeyEl].forEach(el => {
    if(el) el.classList.remove('highlight');
});
    dhAliceSecretEl.textContent = 'SA';
    dhBobSecretEl.textContent = 'SB';
    dhAlicePublicEl.textContent = '?';
    dhBobPublicEl.textContent = '?';
    dhAliceSharedEl.textContent = '?';
    dhBobSharedEl.textContent = '?';
    dhPublicKeyEl.textContent = 'P';
    setDhButtons(true);
}

    async function handleDhExchange() {
    setDhButtons(false);

    const p = 'P', sa = 'SA', sb = 'SB';
    const psa = `${p}-${sa}`;
    const psb = `${p}-${sb}`;
    const shared = `${p}-${sa}-${sb}`;

    generateInitialDh();
    dhPublicKeyEl.classList.add('highlight');
    await sleep(2000);

    dhLog.innerHTML += '<p>2. A 準備一個自己的私密金鑰 SA，B 也準備一個自己的私密金鑰 SB。</p>';
    dhPublicKeyEl.classList.remove('highlight');
    dhAliceSecretEl.classList.add('highlight');
    dhBobSecretEl.classList.add('highlight');
    await sleep(2000);

    dhLog.innerHTML += `<p>3. A 將公開金鑰 P 與自己的私密金鑰 SA「合成」產生一個新的金鑰 P-SA。<br>4. B 將公開金鑰 P 與自己的私密金鑰 SB「合成」產生一個新的金鑰 P-SB。</p>`;
    dhAlicePublicEl.textContent = psa;
    dhBobPublicEl.textContent = psb;
    dhAliceSecretEl.classList.remove('highlight');
    dhBobSecretEl.classList.remove('highlight');
    dhAlicePublicEl.classList.add('highlight');
    dhBobPublicEl.classList.add('highlight');
    await sleep(2500);

    dhLog.innerHTML += '<p>5. A 和 B 互相交換他們「合成」後的金鑰。</p>';
    const alicePacket = createPacket(psa, dhAlicePublicEl);
    const bobPacket = createPacket(psb, dhBobPublicEl);
    dhContainer.append(alicePacket, bobPacket);
    await sleep(100);
    movePacket(alicePacket, dhBobPublicEl);
    movePacket(bobPacket, dhAlicePublicEl);
    await sleep(1100);

    dhAlicePublicEl.classList.remove('highlight');
    dhBobPublicEl.classList.remove('highlight');
    alicePacket.remove();
    bobPacket.remove();

    dhLog.innerHTML += `<p>6. A 收到 B 傳來的 P-SB 後，再與自己的私密金鑰 SA 進行「合成」。<br>7. B 收到 A 傳來的 P-SA 後，再與自己的私密金鑰 SB 進行「合成」。</p>`;
    dhAliceSharedEl.textContent = shared;
    dhBobSharedEl.textContent = shared;
    dhAliceSharedEl.classList.add('highlight');
    dhBobSharedEl.classList.add('highlight');
    await sleep(2500);

    dhLog.innerHTML += '<p><b>8. 完成！他們得到了完全相同的共享秘密金鑰。</b></p>';
    dhLog.innerHTML += '<p>9. 第三方無法從 P, P-SA, P-SB 推算出 SA 或 SB。</p>';
    setDhButtons(true);
}

    function createPacket(value, startEl) {
    const packet = document.createElement('div');
    const rect = startEl.getBoundingClientRect();
    const containerRect = dhContainer.getBoundingClientRect();
    packet.className = 'dh-value-box dh-packet';
    packet.textContent = value;
    packet.style.top = `${rect.top - containerRect.top}px`;
    packet.style.left = `${rect.left - containerRect.left}px`;
    return packet;
}
    function movePacket(packet, endEl) {
    const rect = endEl.getBoundingClientRect();
    const containerRect = dhContainer.getBoundingClientRect();
    packet.style.top = `${rect.top - containerRect.top}px`;
    packet.style.left = `${rect.left - containerRect.left}px`;
}

    function setDhButtons(enabled) {
    dhStartBtn.disabled = !enabled;
    dhResetBtn.disabled = !enabled;
}

    dhStartBtn.addEventListener('click', handleDhExchange);
    dhResetBtn.addEventListener('click', generateInitialDh);

    // --- K-Means Clustering ---
    const clusteringSvg = document.getElementById('clustering-svg');
    const clusteringContainer = document.getElementById('clustering-container');
    const kMeansKInput = document.getElementById('k-means-k');
    const kMeansStartBtn = document.getElementById('k-means-start-btn');
    const kMeansResetBtn = document.getElementById('k-means-reset-btn');
    let points = [];
    let centroids = [];
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

    function generateInitialPoints() {
    if(!clusteringSvg) return;
    clusteringSvg.innerHTML = '';
    points = [];
    const width = clusteringContainer.clientWidth;
    const height = clusteringContainer.clientHeight;
    for (let i = 0; i < 150; i++) {
    points.push({ x: Math.random() * (width - 20) + 10, y: Math.random() * (height - 20) + 10 });
}
    drawClustering();
}

    function drawClustering(clusters = []) {
    if(!clusteringSvg) return;
    clusteringSvg.innerHTML = '';

    // Draw lines first so they are in the background
    if (clusters.length > 0) {
    points.forEach((point, i) => {
    const clusterIndex = clusters[i];
    if (clusterIndex !== undefined && centroids[clusterIndex]) {
    const centroid = centroids[clusterIndex];
    const line = createSvgElement('line', {
    x1: point.x, y1: point.y,
    x2: centroid.x, y2: centroid.y,
    stroke: colors[clusterIndex], 'stroke-width': 0.5,
    class: 'cluster-assignment-line'
});
    clusteringSvg.appendChild(line);
}
});
}

    points.forEach((point, i) => {
    const circle = createSvgElement('circle', {
    cx: point.x, cy: point.y, r: 5,
    fill: clusters[i] !== undefined ? colors[clusters[i]] : '#7f8c8d',
    class: 'cluster-point', id: `point-${i}`
});
    clusteringSvg.appendChild(circle);
});
    centroids.forEach((c, i) => {
    const path = `M ${c.x - 7} ${c.y - 7} L ${c.x + 7} ${c.y + 7} M ${c.x - 7} ${c.y + 7} L ${c.x + 7} ${c.y - 7}`;
    const cross = createSvgElement('path', {
    d: path,
    stroke: colors[i], 'stroke-width': 3,
    class: 'cluster-centroid', id: `centroid-${i}`
});
    clusteringSvg.appendChild(cross);
});
}

    async function handleKMeans() {
    setKMeansButtons(false);
    const k = parseInt(kMeansKInput.value);

    centroids = [];
    const usedIndexes = new Set();
    while(centroids.length < k) {
    const idx = Math.floor(Math.random() * points.length);
    if (!usedIndexes.has(idx)) {
    centroids.push({...points[idx]});
    usedIndexes.add(idx);
}
}
    drawClustering();
    await sleep(1000);

    let assignments = new Array(points.length);
    let changed = true;
    let iterations = 0;

    while(changed && iterations < 20) { // Add iteration limit
    iterations++;
    changed = false;

    // Assignment step
    let newAssignments = [];
    for(let i=0; i<points.length; i++) {
    let minDist = Infinity;
    let bestCluster = -1;
    for(let j=0; j<centroids.length; j++) {
    const dist = Math.hypot(points[i].x - centroids[j].x, points[i].y - centroids[j].y);
    if(dist < minDist) {
    minDist = dist;
    bestCluster = j;
}
}
    if (assignments[i] !== bestCluster) {
    changed = true;
}
    newAssignments[i] = bestCluster;
}
    assignments = newAssignments;
    drawClustering(assignments);
    await sleep(800);

    if(!changed) break;

    // Update step
    const newCentroids = Array.from({length: k}, () => ({x:0, y:0, count:0}));
    for(let i=0; i<points.length; i++) {
    const clusterIndex = assignments[i];
    newCentroids[clusterIndex].x += points[i].x;
    newCentroids[clusterIndex].y += points[i].y;
    newCentroids[clusterIndex].count++;
}

    for(let i=0; i<k; i++) {
    if(newCentroids[i].count > 0) {
    centroids[i] = { x: newCentroids[i].x / newCentroids[i].count, y: newCentroids[i].y / newCentroids[i].count };
}
}
    drawClustering(assignments);
    await sleep(800);
}
    setKMeansButtons(true);
}

    function setKMeansButtons(enabled) {
    kMeansStartBtn.disabled = !enabled;
    kMeansResetBtn.disabled = !enabled;
}

    kMeansStartBtn.addEventListener('click', handleKMeans);
    kMeansResetBtn.addEventListener('click', generateInitialPoints);


    // --- 頁籤切換邏輯 ---
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        tabs.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(targetId).classList.add('active');

        if (targetId === "quicksort" && quicksortContainer.innerHTML === '') generateQuicksortArray();
        else if (targetId === "selection-sort" && selectionContainer.innerHTML === '') generateSelectionArray();
        else if (targetId === "list" && listSvg.innerHTML.trim() === '') generateInitialList();
        else if (targetId === "array" && arraySvg.innerHTML.trim() === '') generateInitialArray();
        else if (targetId === "stack" && stackSvg.innerHTML.trim() === '') generateInitialStack();
        else if (targetId === "queue" && queueSvg.innerHTML.trim() === '') generateInitialQueue();
        else if (targetId === "hash-table" && hashTableSvg.innerHTML.trim() === '') generateInitialHashTable();
        else if (targetId === "heap" && heapSvg.innerHTML.trim() === '') generateInitialHeap();
        else if (targetId === "bst" && bstSvg.innerHTML.trim() === '') generateInitialBST();
        else if (targetId === "bfs" && bfsSvg.innerHTML.trim() === '') drawGraph(bfsSvg, 'bfs');
        else if (targetId === "dfs" && dfsSvg.innerHTML.trim() === '') drawGraph(dfsSvg, 'dfs');
        else if (targetId === "dh" && dhLog.innerHTML.trim() === '') generateInitialDh();
        else if (targetId === "clustering" && clusteringSvg.innerHTML.trim() === '') generateInitialPoints();
    });
});
    window.onload = generateSelectionArray;