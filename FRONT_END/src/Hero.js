import abdo from './images/abdo.jpg'
function Hero(props) {
    var badgeText
    if(props.openspot == 0){
        badgeText="Sold Out"
    }
    else {
        badgeText="Online"
    }

    return(
<div className="m-5 border w-80 shadow-xl transform hover:scale-105 pb-5 rounded-2xl">
    <div className="relative">
        <div className="">
            <img src={props.item.img} alt="Hero" className="hero-img rounded-xl w-80" />
        </div>
        {props.openspot === 0 && (<div className="absolute top-2 left-2 font-semibold text-lg bg-white text-red-600 px-3 py-1 rounded-lg"> {badgeText} </div> )}
        {props.openspot > 0 && (<div className="absolute top-2 left-2 font-semibold text-lg bg-white text-green-600 px-3 py-1 rounded-lg"> {badgeText} </div> )}
    </div>
    <div className="ml-2">
        <div className='flex items-center'>
            <span className='text-yellow-400 text-3xl'>★★★★★</span>
            <div className='p-5 -m-3'>{props.item.location}</div>
        </div>
        <h1 className="font-semibold text-lg">{props.item.full_name}</h1>
        <p className="text-md">{props.item.email}</p>
    </div>
</div>   
    )
}

const Heros = [
    {id:0,item:{img:abdo,full_name:"Abdellah Elazzaoui",email:"elazzaoui859@gmail.com",openspot:0  , location:"Agadir-Morocco"}},
    {id:1,item:{img:abdo,full_name:"Abdellah Elazzaoui",email:"elazzaoui859@gmail.com",openspot:1  , location:"Agadir-Morocco"}},
    {id:2,item:{img:abdo,full_name:"Abdellah Elazzaoui",email:"elazzaoui859@gmail.com",openspot:0  , location:"Agadir-Morocco"}},
    {id:3,item:{img:abdo,full_name:"Abdellah Elazzaoui",email:"elazzaoui859@gmail.com",openspot:13 , location:"Agadir-Morocco"}},
    {id:4,item:{img:abdo,full_name:"Abdellah Elazzaoui",email:"elazzaoui859@gmail.com",openspot:0  , location:"Agadir-Morocco"}},
    {id:5,item:{img:abdo,full_name:"Abdellah Elazzaoui",email:"elazzaoui859@gmail.com",openspot:10 , location:"Agadir-Morocco"}},    
]

function Get_Heros() {
    const Heros_Elements = Heros.map(hero =>{
        return <Hero key={hero.id} item = {hero.item} />
    }
    )
    return(
        <div className="w-full">
            <div className="flex overflow-x-auto pb-4">
                <div className="flex gap-4 px-4">
                    {Heros_Elements}
                </div>
            </div>
        </div>
    )
}

export default Get_Heros