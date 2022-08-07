import React, { useEffect, useState } from 'react'

export const Table = () => {

    const branch1_url = "./branch1.json";
    const branch2_url = "./branch2.json";
    const branch3_url = "./branch3.json";
    let total = 0;
    const [salesTableData, setSalesTableData] = useState([]);
    const [products, setProducts] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [branch, setBranch] = useState("All");

    const fetch_data = (url) => {
        return fetch(url, { headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        })
            .then(res => res.json())
    }

    const compile_data = () => {
        Promise.all([fetch_data(branch1_url), fetch_data(branch2_url), fetch_data(branch3_url)])
            .then((values) => {
                let tempSalesData = [];
                let tempProducts = [];
                values.forEach(branch => {
                    const branch_name = branch.branchId;
                    
                    branch.products.forEach(product => {
                        if(!tempProducts.includes(product.name)){
                            tempProducts.push(product.name);
                        }
                        tempSalesData.push({...product, branch: branch_name});
                    });
                });
               
                tempProducts.sort();
                setProducts(tempProducts);
                setSalesData(tempSalesData);
            });
    }

    const calculate_revenue = (branch) => {
        //-1 indicates all branches
        if(branch === "all"){
            let tempSalesTableData = [];
            products.forEach(product => {
                let totalSale = 0;
                salesData.forEach(data => {
                    if(data.name === product){
                        totalSale += (data.sold * data.unitPrice);
                    }
                });
                tempSalesTableData.push({name: product, revenue: totalSale});
            })
            setSalesTableData(tempSalesTableData);
        }else{
            let tempSalesTableData = [];
            products.forEach(product => {
                let totalSale = 0;
                salesData.forEach(data => {
                    if(data.name === product && data.branch === branch){
                        totalSale += (data.sold * data.unitPrice);
                    }
                });
                tempSalesTableData.push({name: product, revenue: totalSale});
            })
            setSalesTableData(tempSalesTableData);
        }
    }

    const debouce = (fn, delay) => {
        let timer;
        return function(...args){
            if(timer){
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn(...args);
            }, delay);
        }
    }

    useEffect(() => {
        compile_data();
    },[]);
    
    useEffect(() => {
        calculate_revenue("all");
    },[salesData]);

    return (
        <div>
            <h2>Revenue Aggregator Application</h2>
            <button style={{ padding: '15px' }} onClick={() => {setBranch("All"); calculate_revenue("all")}}>All</button>
            <button style={{ padding: '15px' }} onClick={() => {setBranch("Branch 1"); calculate_revenue("b1")}}>Branch 1</button>
            <button style={{ padding: '15px' }} onClick={() => {setBranch("Branch 2"); calculate_revenue("b2")}}>Branch 2</button>
            <button style={{ padding: '15px' }} onClick={() => {setBranch("Branch 3"); calculate_revenue("b3")}}>Branch 3</button>
            <br />
            <p>Selected Branch: {branch}</p>
            <table style={{ width: "100%",  }} border={1}>
                <thead>
                    <tr>
                        <th style={{padding: '10px'}}>Sr. No</th>
                        <th style={{padding: '10px'}}>Product Name</th>
                        <th style={{padding: '10px'}}>Revenue</th>
                    </tr>
                    <tr>
                        <th style={{padding: '10px'}}></th>
                        <th style={{padding: '10px'}}>
                            <input onChange={debouce((e) => {
                                console.log('searching..');
                                setSearchInput(e.target.value)
                                }, 300) } style={{ margin: '10px 0px', padding: '10px', width: '90%', fontSize: '14px' }} placeholder='Search for product' />
                        </th>
                        <th style={{padding: '10px'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        salesTableData.filter(row => row.name.toLowerCase().includes(searchInput.toLowerCase())).map((value, key) => {
                            total += value.revenue;
                            return (<tr key={key}>
                                <td style={{padding: '10px'}}>{ key + 1 }</td>
                                <td style={{padding: '10px'}}>{ value.name }</td>
                                <td style={{padding: '10px'}}>{  value.revenue.toLocaleString() }</td>
                            </tr>)
                        })
                    }
                   
                </tbody>
                <tfoot>
                     <tr >
                        <td style={{padding: '10px'}}></td>
                        <td style={{padding: '10px'}}>Total</td>
                        <td style={{padding: '10px'}}>{ total.toLocaleString() }</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
