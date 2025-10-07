// import React, {useState} from 'react'
// import { NeuralNetwork } from 'brainjs'

// export default function BrainDemo(){
//   const [trained, setTrained] = useState(false)
//   const [result, setResult] = useState(null)

//   const data = [
//     { input: { hours: 0 }, output: { fail: 1 } },
//     { input: { hours: 1 }, output: { fail: 1 } },
//     { input: { hours: 2 }, output: { pass: 1 } },
//     { input: { hours: 3 }, output: { pass: 1 } },
//     { input: { hours: 4 }, output: { pass: 1 } },
//     { input: { hours: 0.5 }, output: { fail: 1 } }
//   ]

//   const train = () =>{
//     const net = new NeuralNetwork({ hiddenLayers: [3] })
//     net.train(data, { log: false, iterations: 2000 })
//     const json = net.toJSON()
//     localStorage.setItem('school-ai-model', JSON.stringify(json))
//     setTrained(true)
//     alert('Model trained and saved locally. Try predictions below.')
//   }

//   const predict = (hours)=>{
//     const raw = localStorage.getItem('school-ai-model')
//     if(!raw){ alert('Train model first'); return }
//     const net = new NeuralNetwork()
//     net.fromJSON(JSON.parse(raw))
//     const out = net.run({ hours: Number(hours) })
//     setResult(out)
//   }

//   return (
//     <div className="p-4 border rounded space-y-3">
//       <div className="flex gap-2">
//         <button onClick={train} className="px-3 py-2 bg-indigo-600 text-white rounded">Train model</button>
//         <button onClick={()=>{ localStorage.removeItem('school-ai-model'); setTrained(false); setResult(null) }} className="px-3 py-2 bg-gray-200 rounded">Reset</button>
//       </div>

//       <div className="mt-2">
//         <label className="text-sm">Hours studied (0–6)</label>
//         <div className="flex gap-2 mt-1">
//           <input id="hoursInput" type="number" defaultValue={2} min={0} max={12} step={0.1} className="rounded border px-2 py-1" />
//           <button onClick={()=>predict(document.getElementById('hoursInput').value)} className="px-3 py-2 bg-sky-600 text-white rounded">Predict</button>
//         </div>
//       </div>

//       {result && (
//         <div className="text-sm">Prediction: <strong>{result.pass > result.fail ? 'Likely to pass' : 'Likely to fail'}</strong> — raw: {JSON.stringify(result)}</div>
//       )}

//       <div className="text-xs text-gray-500">This is a toy demo of brain.js running in the browser. It trains on a tiny dataset and saves the model to localStorage.</div>
//     </div>
//   )
// }