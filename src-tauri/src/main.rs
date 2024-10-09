// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::collections::{HashMap, LinkedList};
use std::fs::File;
use std::io::Read;
use std::sync::Mutex;

pub const SEPARATOR: &'static str =
    "**************************************************************";

#[derive(Default, Serialize, Deserialize, Clone)]
struct Graph {
    pub v: u64,
    pub e: u64,
    pub adj_list: Vec<LinkedList<u64>>,
    pub edges: Vec<(u64, u64)>,
}

#[derive(Default, Serialize, Deserialize)]
struct GraphState {
    pub graph: Mutex<Graph>,
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
async fn get_graph(state: tauri::State<'_, GraphState>) -> Result<Graph, ()> {
    let mut input_file = File::open("./input_graph.txt").unwrap();
    let mut graph_string = String::new();
    input_file.read_to_string(&mut graph_string).unwrap();
    let graph_data: Vec<&str> = graph_string.trim().split('\n').collect();

    let mut locked_graph = state.graph.lock().unwrap();
    locked_graph.v = graph_data[0].parse::<u64>().unwrap();
    locked_graph.e = graph_data[1].parse::<u64>().unwrap();
    for _ in 0..locked_graph.v {
        locked_graph.adj_list.push(LinkedList::new());
    }
    for i in 2..graph_data.len() {
        let str_edge: Vec<&str> = graph_data[i].split(' ').collect();
        let u = str_edge[0].parse::<u64>().expect("Error parsing the file!");
        let v = str_edge[1].parse::<u64>().expect("Error parsing the file!");
        locked_graph.adj_list[u as usize].push_back(v);
        locked_graph.adj_list[v as usize].push_back(u);
        locked_graph.edges.push((u, v));
    }
    Ok(locked_graph.clone())
}

#[derive(Default, Serialize, Deserialize)]
struct DBPoints {
    points: Mutex<HashMap<u64, Vec<(f64, f64)>>>,
}
// remember to call `.manage(DBPoints::default())`
#[tauri::command]
async fn get_points(
    state: tauri::State<'_, DBPoints>,
) -> Result<HashMap<u64, Vec<(f64, f64)>>, ()> {
    let mut db_file = File::open("./input_database.txt").unwrap();
    let mut database_string = String::new();
    db_file.read_to_string(&mut database_string).unwrap();
    let mut database_relations: Vec<&str> = database_string.trim().split(SEPARATOR).collect();

    database_relations.remove(database_relations.len() - 1);

    for relation in database_relations {
        let records: Vec<&str> = relation.trim().split('\n').collect();
        let color = records[0].parse::<u64>().unwrap();
        let mut values = Vec::new();
        for i in 1..records.len() {
            let coordinates: Vec<&str> = records[i].trim().split(',').collect();
            values.push((
                coordinates[0][1..].parse::<f64>().unwrap(),
                coordinates[1][1..(coordinates[1]).len() - 1]
                    .parse::<f64>()
                    .unwrap(),
            ));
        }
        (*state).points.lock().unwrap().insert(color, values);
    }
    Ok((*state).points.lock().unwrap().clone())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(DBPoints::default())
        .manage(GraphState::default())
        .invoke_handler(tauri::generate_handler![get_points, get_graph])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Very likely to define all similarity join functions here, but we will see
