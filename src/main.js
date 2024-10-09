const { invoke } = window.__TAURI__.core;

class Node {
  // constructor
  constructor(element) {
    this.element = element;
    this.next = null
  }
};
// linkedlist class
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // adds an element at the end
  // of list
  add(element) {
    // creates a new node
    let node = new Node(element);

    // to store current node
    let current;

    // if list is Empty add the
    // element and make it head
    if (this.head == null)
      this.head = node;
    else {
      current = this.head;

      // iterate to the end of the
      // list
      while (current.next) {
        current = current.next;
      }

      // add node
      current.next = node;
    }
    this.size++;
  }

  // insert element at the position index
  // of the list
  insertAt(element, index) {
    if (index < 0 || index > this.size)
      return console.log("Please enter a valid index.");
    else {
      // creates a new node
      let node = new Node(element);
      let curr, prev;

      curr = this.head;

      // add the element to the
      // first index
      if (index == 0) {
        node.next = this.head;
        this.head = node;
      } else {
        curr = this.head;
        let it = 0;

        // iterate over the list to find
        // the position to insert
        while (it < index) {
          it++;
          prev = curr;
          curr = curr.next;
        }

        // adding an element
        node.next = curr;
        prev.next = node;
      }
      this.size++;
    }
  }

  // removes an element from the
  // specified location
  removeFrom(index) {
    if (index < 0 || index >= this.size)
      return console.log("Please Enter a valid index");
    else {
      let curr, prev, it = 0;
      curr = this.head;
      prev = curr;

      // deleting first element
      if (index === 0) {
        this.head = curr.next;
      } else {
        // iterate over the list to the
        // position to remove an element
        while (it < index) {
          it++;
          prev = curr;
          curr = curr.next;
        }

        // remove the element
        prev.next = curr.next;
      }
      this.size--;

      // return the remove element
      return curr.element;
    }
  }

  // removes a given element from the
  // list
  removeElement(element) {
    let current = this.head;
    let prev = null;

    // iterate over the list
    while (current != null) {
      // comparing element with current
      // element if found then remove the
      // and return true
      if (current.element === element) {
        if (prev == null) {
          this.head = current.next;
        } else {
          prev.next = current.next;
        }
        this.size--;
        return current.element;
      }
      prev = current;
      current = current.next;
    }
    return -1;
  }


  // finds the index of element
  indexOf(element) {
    let count = 0;
    let current = this.head;

    // iterate over the list
    while (current != null) {
      // compare each element of the list
      // with given element
      if (current.element === element)
        return count;
      count++;
      current = current.next;
    }

    // not found
    return -1;
  }

  // checks the list for empty
  isEmpty() {
    return this.size == 0;
  }

  // gives the size of the list
  size_of_list() {
    return this.size;
  }


  // prints the list items
  printList() {
    let curr = this.head;
    let str = "";
    while (curr) {
      str += curr.element + " ";
      curr = curr.next;
    }
    console.log(str);
  }

};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function get_neighboring_cells(cell, r, eps) {
  let clicked_id_str = cell.getAttribute("cell-id").split('_');
  let clicked_id = [parseInt(clicked_id_str[0]), parseInt(clicked_id_str[1])];
  let n_cells_per_direction = Math.ceil(r / eps);
  let cell_domain = new Set();
  for (let row = 0; row < n_cells_per_direction; row++) {
    for (let col = 0; col < n_cells_per_direction; col++) {
      cell_domain.add([clicked_id[0] - row, clicked_id[1] - col]);
      cell_domain.add([clicked_id[0] - row, clicked_id[1] + col]);
      cell_domain.add([clicked_id[0] + row, clicked_id[1] - col]);
      cell_domain.add([clicked_id[0] + row, clicked_id[1] + col]);
    }
  }
  let result = new Map();
  for (let id of cell_domain) {
    let id_str = `${id[0]}_${id[1]}`;
    let cell_ = document.querySelector(`[cell-id="${id_str}"]`);
    if (cell_) {
      result.set(id_str, cell_);
    }
  }
  return result;
};

function is_too_far(cell, cell_prime, r, eps) {
  return !get_neighboring_cells(cell, r, eps).has(cell_prime.getAttribute("cell-id"));
};

async function select_neighboring_cells(cell, r, eps) {
  let cell_domain = get_neighboring_cells(cell, r, eps);
  let clicked_id = cell.getAttribute("cell-id");
  // Select all cells
  for (let [id, cell_] of cell_domain) {
    await delay(100);
    cell_.setAttribute("style", "border-style: dotted;");
  }
  // Select non-empty cells
  let non_empty_cells = new Map();
  for (let [id, cell_] of cell_domain) {
    if (cell_.childElementCount == 0) {
      await delay(100);
      cell_.setAttribute("style", "border-style: hidden;");
    } else if (cell_.childElementCount > 0 && id != clicked_id) {
      non_empty_cells.set(id, cell_);
    }
  }
  return non_empty_cells;
};

function get_points_count_by_color(cell, color) {
  let text_to_color = new Map();
  let result = 0;
  // 0: "red",
  // 1: "yellow",
  // 2: "lime",
  // 3: "aqua",
  // 4: "blue",
  // 5: "blueviolet",
  // 6: "coral",
  // 7: "chocolate",
  // 8: "darkorange",
  // 9: "crimson",
  // 10: "deeppink",
  // 11: "gold",
  // 12: "ivory",
  // 13: "lavender",
  // 14: "lightgray",
  // 15: "magenta"
  text_to_color.set('rgb(255, 0, 0)', 0);
  text_to_color.set('rgb(255, 255, 0)', 1);
  text_to_color.set('rgb(0, 255, 0)', 2);
  text_to_color.set('rgb(0, 255, 255)', 3);
  text_to_color.set('rgb(0, 0, 255)', 4);
  text_to_color.set('rgb(138, 43, 226)', 5);
  text_to_color.set('rgb(255, 127, 80)', 6);
  text_to_color.set('rgb(210, 105, 30)', 7);
  text_to_color.set('rgb(255, 140, 0)', 8);
  text_to_color.set('rgb(220, 20, 60)', 9);
  text_to_color.set('rgb(255, 20, 147)', 10);
  text_to_color.set('rgb(255, 215, 0)', 11);
  text_to_color.set('rgb(255, 255, 240)', 12);
  text_to_color.set('rgb(230, 230, 250)', 13);
  text_to_color.set('rgb(211, 211, 211)', 14);
  text_to_color.set('rgb(255, 0, 255)', 15);
  cell.childNodes.forEach(child => {
    let child_color = child.computedStyleMap().get("background-color").toString();
    if (text_to_color.get(child_color) == color) {
      result += 1;
    }
  });
  return result;
};

function generate_edge(edge, offset, x1, y1, x2, y2) {
  let min_x = Math.min(x1, x2);
  let max_x = Math.max(x1, x2);
  let min_y = Math.min(y1, y2);
  let max_y = Math.max(y1, y2);
  let switch_x = x1 > x2;
  let switch_y = y1 > y2;
  let point_node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  point_node.setAttribute("style", `position:absolute;top:${min_y + offset}px;left:${min_x + offset}px;`);
  point_node.setAttribute("id", `edge_${edge[0]}_${edge[1]}`);

  let point_node_inner = document.createElementNS("http://www.w3.org/2000/svg", "line");
  if (switch_x) {
    point_node_inner.setAttribute("x1", `${max_x - min_x}px`);
    point_node_inner.setAttribute("x2", `0px`);
  } else {
    point_node_inner.setAttribute("x1", `0px`);
    point_node_inner.setAttribute("x2", `${max_x - min_x}px`);
  }

  if (switch_y) {
    point_node_inner.setAttribute("y1", `${max_y - min_y}px`);
    point_node_inner.setAttribute("y2", `0px`);
  } else {
    point_node_inner.setAttribute("y1", `0px`);
    point_node_inner.setAttribute("y2", `${max_y - min_y}px`);
  }
  point_node_inner.setAttribute("style", "stroke:white;stroke-width:2;");
  point_node.appendChild(point_node_inner);
  return point_node;
}

async function update_recursive(q, graph, r, eps, visited, cells_by_vertex, solution, color, colors) {
  console.log("update_recursive start");
  console.log(q);
  if (q.length == 0) {
    console.log(`update_recursive end, solution found!`);
    console.log(solution);
    let offset = solution[graph.edges[0][0]].offsetWidth / 4;
    for (let edge of graph.edges) {
      solution[edge[0]].parentElement.appendChild(generate_edge(edge, offset, solution[edge[0]].offsetLeft, solution[edge[0]].offsetTop, solution[edge[1]].offsetLeft, solution[edge[1]].offsetTop));
    }
    await delay(2000);
    for (let edge of graph.edges) {
      document.querySelector(`#edge_${edge[0]}_${edge[1]}`).remove();
    }
    return;
  }
  let v_j = q.shift();
  console.log(`Working on v_j = ${v_j}`);
  for (let cell_prime = cells_by_vertex[v_j].head; cell_prime != null; cell_prime = cell_prime.next) {
    await delay(200);
    console.log(`Setting to selected cell ${cell_prime.element}`);
    cell_prime.element.attributeStyleMap.set("border-style", "dotted");
    let erase_neighbor_lists = false;
    let non_visited_neighbor = [];
    solution[v_j] = cell_prime.element;
    for (let v_h of graph.adj_list[v_j]) {
      console.log(`Working on v_h = ${v_h}`);
      if (visited[v_h]) {
        console.log(`v_h = ${v_h} already visited!`);
        if (solution[v_h]) {
          if (is_too_far(cell_prime.element, solution[v_h], r, eps)) {
            console.log(`v_h = ${v_h} is too far from v_j = ${v_j}!`);
            solution[v_j] = null;
            erase_neighbor_lists = true;
            break;
          }
        }
      } else {
        console.log(`v_h = ${v_h} not visited!`);
        non_visited_neighbor.push(v_h);
        let nb_cells = await select_neighboring_cells(cell_prime.element, r, eps);
        for (let [id, cell_bar] of nb_cells) {
          if (get_points_count_by_color(cell_bar, v_h) > 0 && !is_too_far(cell_prime.element, cell_bar, r, eps)) {
            await delay(100);
            console.log(`cell_bar = ${cell_bar} close enough!`);
            cell_bar.attributeStyleMap.set("background-color", `${colors[v_h]}`);
            cell_bar.attributeStyleMap.set("opacity", "50%");
            cells_by_vertex[v_h].add(cell_bar);
          } else {
            await delay(100);
            console.log(`cell_bar = ${cell_bar} not close enough!`);
            cell_bar.attributeStyleMap.set("border-style", "hidden");
          }
        }
        if (cells_by_vertex[v_h].isEmpty()) {
          console.log(`No valid solutions for v_h = ${v_h}`);
          solution[v_j] = null;
          erase_neighbor_lists = true;
        }
      }
    }
    if (erase_neighbor_lists) {
      console.log(`Erasing v_h lists`);
      for (let v_h of non_visited_neighbor) {
        for (let cell_bar = cells_by_vertex[v_h].head; cell_bar != null; cell_bar = cell_bar.next) {
          await delay(100);
          cell_bar.attributeStyleMap.set("opacity", "100%");
        }
        cells_by_vertex[v_h] = new LinkedList();
      }
    } else {
      console.log(`Pushing v_j = ${v_j} neighbors into the queue`);
      for (let v_h of non_visited_neighbor) {
        visited[v_h] = true;
        q.push(v_h);
      }
      console.log(`Recursive call`);
      await update_recursive([...q], graph, r, eps, visited, cells_by_vertex, solution, color, colors);
      console.log(`Backtrack`);
      for (let v_h of non_visited_neighbor) {
        visited[v_h] = false;
        q.pop();
        for (let cell_bar = cells_by_vertex[v_h].head; cell_bar != null; cell_bar = cell_bar.next) {
          await delay(100);
          cell_bar.element.setAttribute("style", "background-color: black; opacity: 100%; border-style: hidden;");
        }
        cells_by_vertex[v_h] = new LinkedList();
      }
      if (solution[v_j]) {
        solution[v_j].setAttribute("style", "background-color: black; opacity: 100%; border-style: hidden;");
      }
      solution[v_j] = null;
    }
  }
  return;
};

async function main() {
  const eps = 0.2;
  const r = 1.0;
  const nCellsPerDimension = Math.ceil(10.0 / eps);
  const points = await invoke("get_points", 64);
  let graph = await invoke("get_graph", 64);
  console.log(graph);
  console.log(Object.keys(points).length);
  if (graph.v === Object.keys(points).length) {
    const COLORS = {
      0: "red",
      1: "yellow",
      2: "lime",
      3: "aqua",
      4: "blue",
      5: "blueviolet",
      6: "coral",
      7: "chocolate",
      8: "darkorange",
      9: "crimson",
      10: "deeppink",
      11: "gold",
      12: "ivory",
      13: "lavender",
      14: "lightgray",
      15: "magenta"
    };
    let animationOn = false;

    let points_new_format = {};
    for (let color in points) {
      for (let point of points[color]) {
        let cell_coordinates = [Math.floor(point[0] / eps), Math.floor(point[1] / eps)];
        if (cell_coordinates in points_new_format) {
          points_new_format[cell_coordinates].push([point, color]);
        } else {
          points_new_format[cell_coordinates] = [[point, color]];
        }
      }
    }

    let grid = document.querySelector(".grid-container");
    grid.setAttribute("style", `position: relative; grid-template-columns: repeat(${nCellsPerDimension}, 1fr)`);
    for (let i = 0; i < nCellsPerDimension * nCellsPerDimension; i++) {
      let cell_key = [Math.floor(i / nCellsPerDimension), i % nCellsPerDimension];
      let cell = document.createElement("div");
      cell.setAttribute("cell-id", `${cell_key[0]}_${cell_key[1]}`);
      cell.setAttribute("class", "grid-item");
      if (points_new_format[cell_key]) {
        for (let [point, color] of points_new_format[cell_key]) {
          let point_node = document.createElement("div");
          point_node.setAttribute("class", "box");
          point_node.setAttribute("style", `left: ${(point[0] / eps) % 1 * 100}%; bottom: ${(point[1] / eps) % 1 * 100}%; background-color: ${COLORS[color]};`);
          cell.appendChild(point_node);
        }
      }
      cell.addEventListener("mouseenter", e => {
        e.preventDefault();
        if (!animationOn) {
          cell.setAttribute("style", "border-style: dotted;");
        }
      });
      cell.addEventListener("mouseleave", e => {
        e.preventDefault();
        if (!animationOn) {
          cell.setAttribute("style", "border-style: hidden;");
        }
      });
      cell.addEventListener("click", async (e) => {
        e.preventDefault();
        animationOn = true;
        let new_point = document.createElement("div");
        new_point.setAttribute("class", "box");
        new_point.setAttribute("style", `left: ${(e.offsetX / cell.offsetWidth) % 1 * 100}%; bottom: ${((cell.offsetHeight - e.offsetY) / cell.offsetHeight) % 1 * 100}%; background-color: red;`);
        cell.appendChild(new_point);
        // Initialize all data structures needed for update recursive
        let q = [0];
        let visited = [];
        for (let i = 0; i < graph.v; i++) {
          visited.push(false);
        }
        visited[0] = true;
        let cells_by_vertex = [];
        for (let i = 0; i < graph.v; i++) {
          cells_by_vertex.push(new LinkedList());
        }
        cells_by_vertex[0].add(cell);
        let solution = [];
        for (let i = 0; i < graph.v; i++) {
          solution.push(null);
        }
        await update_recursive(q, graph, r, eps, visited, cells_by_vertex, solution, 0, COLORS);
        animationOn = false;
      })
      grid.appendChild(cell);
    }
  } else {
    let grid = document.querySelector(".grid-container");
    let error_text = document.createElement("h1");
    error_text.setAttribute("style", "color: white");
    error_text.innerText = "Number of relations not equal to the number of vertices in the graph!";
    grid.appendChild(error_text);
  }
};

main();