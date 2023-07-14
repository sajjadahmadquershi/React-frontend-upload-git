import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./styile.css"
import FileBase64 from 'react-file-base64';

const Multiinputs = () => {
    const [product, setproduct] = useState([])
    // const daseapifetch = async () => {
    //     const data = await fetch("http://localhost:5000/api/vi/product")
    //     const finaldata = await data.json()
    //     setproduct(finaldata.myDATA)
    // }
    const daseapifetch = async () => {
        const data = await axios.get("http://localhost:5000/api/vi/product")
        console.log(data.data.myDATA);
        setproduct(data.data.myDATA)
    }
    useEffect(() => {
        daseapifetch()
    }, [])
    const [editbtnsho, seteditbtnsho] = useState(true)
    const [editbtnval, seteditbtnval] = useState(null)
    const [inpvalue, settinpvalue] = useState({
        title: "",
        desc: "",
        price: "",
        rating: "",
        selectedfile: "",
        date: ""
    })
    let submithandler = async (e) => {
        e.preventDefault() 
        if (editbtnsho === false && inpvalue.title && inpvalue.desc && inpvalue.price && inpvalue.rating && inpvalue.selectedfile) {
            setproduct(
                product.map((editdata)=>{
                    if (editdata._id===editbtnval) {
                        return inpvalue 
                    }
                    return editdata;
                })
            )
            try {
                await axios.patch(`http://localhost:5000/api/vi/product/${editbtnval}`, inpvalue)
            } catch (error) {
                console.log("not data submit , data submit nahee huva");
            }
            settinpvalue({
                title: "",
                desc: "",
                price: "",
                rating: "",
                selectedfile: "",
                date: ""
            })
            seteditbtnsho(true)
        } else if (inpvalue.title && inpvalue.desc && inpvalue.price && inpvalue.rating && inpvalue.selectedfile) {
            
            setproduct([...product, inpvalue])
            try {
                await axios.post("http://localhost:5000/api/vi/product", inpvalue)
            } catch (error) {
                console.log("not data submit");
            }
            settinpvalue({
                title: "",
                desc: "",
                price: "",
                rating: "",
                selectedfile: "",
                date: ""
            })
        }else {
            alert("Fill all inputs feld")
        }
    } 
    let inputvalues = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        settinpvalue({ ...inpvalue, [name]: value })
        //console.log('this is', inpvalue);
    }
    let deletes = async (del) => {
        console.log(del);
        try {
            await axios.delete(`http://localhost:5000/api/vi/product/${del}`)
        } catch (error) {
            console.log("not data delete");
        }
        let deleatedata = product.filter((dele) => dele._id !== del)
        setproduct(deleatedata)
    }
    let edit = (edit, i) => {
        console.log(edit);
        settinpvalue({
                title:product[i].title,
                desc: product[i].desc,
                price: product[i].price,
                rating: product[i].rating,
                selectedfile: product[i].selectedfile,
            })
            seteditbtnval(edit)
        seteditbtnsho(!editbtnsho)
    }
    return (
        <div className='contanier'>
            <form action="" onSubmit={submithandler}>
                <div className="inp-man-card">
                    <div className="inp-div">
                        <label htmlFor="hading">Hading</label>
                        <input type="text" placeholder='Plz fill your Hadding' name='title' value={inpvalue.title} id="Hading" onChange={inputvalues} />
                    </div>

                    <div className="inp-div">
                        <label htmlFor="Discripution">Discripution</label>
                        <input type="text" placeholder='Plz fill your Discr' name='desc' value={inpvalue.desc} id="Discripution" onChange={inputvalues} />
                    </div>

                    <div className="inp-div">
                        <label htmlFor="price">price</label>
                        <input type="text" placeholder='Plz fill your price' name='price' value={inpvalue.price} id="price" onChange={inputvalues} />
                    </div>

                    <div className="inp-div">
                        <label htmlFor="Rating">Rating</label>
                        <input type="text" placeholder='Plz fill your Rating' name='rating' value={inpvalue.rating} id="Rating" onChange={inputvalues} />
                    </div>

                    <div className="inp-div">
                        <label htmlFor="hading">File</label>
                        {/* <input type="file" name='File' value={""} id="File" onChange={(e)=>inputvalues(e)} /> */}
                        <FileBase64
                            multiple={false}
                            onDone={({ base64 }) => settinpvalue({ ...inpvalue, selectedfile: base64 })} />
                    </div>

                    <div className="inp-div">
                        {editbtnsho ? <button type='submit' className='btnn'>Submit</button> :
                            <button type='submit'>Edit a Cart</button>
                        }
                    </div>
                </div>
            </form>
            <div className="card">
                {
                    product.map((cart,i) => (
                        <div className='cart' key={cart._id}>
                            <img src={cart.selectedfile} alt="" />
                            <div className="textcontanier">
                                <h2>{cart.title}</h2>
                                <p>{cart.desc}</p>
                                <h5>{cart.rating}</h5>
                                <h3>{cart.price}</h3>
                                <button onClick={(e) => deletes(cart._id)}>Delete a Cart</button>
                                {editbtnsho ? <button onClick={(e) => edit(cart._id,i)}>Edit a Cart</button> : null}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Multiinputs