import { useEffect, useState } from 'react';
import './App.css';
import "@material-tailwind/react/tailwind.css";
import HomePage from './homepage/HomePage'
import CheckOutPage from './checkoutpage/CheckOutPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App() {
  
  const [products, setProducts] = useState([]) // products contém todos os produtos recebidos pela API

  const [filterProduct, setFilterProduct] = useState([]) // products contém todos os produtos recebidos pela API

  const [initialValue, setInitialValue] = useState(0) // estado inicial do Carrinho de compras

  const [isChecked, setIsChecked] = useState(false) // estado boleano do checkbox Extras

  const [currentPage, setCurrentPage] = useState(1) // Página em que o utilizador se encontra 

  const [modalFirstState, setModaFirstlState] = useState("modalContainer1") // Estado em que o cartão dos produtos se encontra (display: none)

  const [modalSecondState] = useState("modalContainer") // Este estado permite que o cartão fique visivel para os utilizadores 

  const productsPerPage = 6 // produtos por página

  const maxPageLimit = 3 // Número máximo de paginas 

  const minPageLimit = 1 // Número mínimo de páginas 

  const [quantity, setQuantity] = useState(1)

  const changePage = (page) => { // função que reencaminha o utilizador para a página que selecionou 
        setCurrentPage(page.target.id)
    } 

  const previousBtn = () => { // Função que permite o utilizador recuar na paginação 
        if(currentPage - 1 <  minPageLimit){
            setCurrentPage(minPageLimit)
        } else {
            setCurrentPage(currentPage - 1)
        }
    }

  const nextBtn = () => { // Função que permite o utilizador avançar na paginação
        if(currentPage + 1 > maxPageLimit){
            setCurrentPage(minPageLimit)
        } else {
            setCurrentPage(currentPage + 1)
        }
    }

  const searchProduct = (input) => { // funação que permite a filtragem de produtos, que permite ao utilizador uma pesquisa rápida e direta face ao que procura 
    let filterProducts = products.filter(product => product.name.toLowerCase().includes(input.target.value.toLowerCase()))
    setFilterProduct(filterProducts) 
  }

  const pages = [] // Array que contém o número de páginas 

    for(let i = 1; i <= Math.ceil(products.length / productsPerPage); ++i) { // For que insere o número de páginas no array pages
        pages.push(i)
    }

  const indexlastProduct = currentPage * productsPerPage // Identifica o último índice da página em que o utilizador se encontra 

  const indexFirstProduct = indexlastProduct - productsPerPage // Identifica o primeiro índice da página em que o utilizador se encontra

  const currentMeals = filterProduct.slice(indexFirstProduct, indexlastProduct) // identifica que produtos são apresentados em cada página (Array de objectos, onde cada objeto se refere à info de cada produto)

  const [productId, setProductId] = useState(1) 

  const product = currentMeals.filter((product) => product.id == productId) // Filtra os produtos que se encontram armazenados na variável currentMeals, se corresponderem ao id do producto selecionado, entao a função openProduct (abaixo) irá apresentar o produto selecionado 

  const openProduct = (product) => {
        setModaFirstlState(modalSecondState)
        setProductId(product.id)
  }

  const closeProduct = () => { // função que permite fechar o produto selecionado 
    setModaFirstlState("modalContainer1")
  }

  const renderProducts = (product) => { //renderiza todos os cards dos produtos na view
    return(
        <ul className="itemsCatalog">
                {
                    product.map((product, index) => {
                        return (
                            <li 
                            className="isolatedItems"
                            key={index}
                            id={product.id} 
                            onClick={() => openProduct(product)}
                            >
                              <h2>{product.name}</h2>
                              <img src={product.image} alt={product.name}/>
                            </li>
                        )
                    } )
                }  
            </ul>
        )
    }

    const renderPageNumbers = pages.map(number => { // renderiza o layout de mudança de página e suas animações
        if(number < maxPageLimit + 1 && number >= minPageLimit){
            return (
                <li
                className={currentPage == number ? "activePage": "disabePage"}
                key={number} 
                id={number}
                onClick={changePage}
                >
                .
                </li>
            )
        } else {
            return null
        }
    })
  
  let selectedExtra = [] // Array que irá conter os extras selecionados 

  const checkBoxOnChange = () => { // função que muda o estado da checkbox
   setIsChecked(!isChecked)
}
  const getExtras = (items, event) => { // função que adiciona ao array selectedExtra os extras selecionados
    if(selectedExtra.includes(items) && (event.target.checked)){
      selectedExtra.splice(items, 1)
    } else {
       selectedExtra.push(items)
    }
  }

  const [productInfo, setProductInfo] = useState([]) // Array que irá conter os produtos que o utilizador selecionou 

  console.log(productInfo )

  const selectedProduct = (product) => { // função que adiciona produtos que utilizador pretende comprar ao array productInfo. O spread Operator insere um novo objeto com as info do produto que o utilizador seleciona.
      product.map(product => {
         setProductInfo(
           [...productInfo, {
            id: `${product.id}${initialValue}`,
            name: product.name,
            image: product.image,
            meal: product.meal,
            extras: selectedExtra,
            quantity: 1,
            price: product.price 
            }
          ]
         )
      })

      if(initialValue == 0) { // se o valor do saco de compras for 0, assim que o utilizador selecionar um produto faz o incremento do mesmo, caso algum produto seja eliminado do saco de compras irá acontecer um decremento do mesmo, não existindo possibilidade e haver número inferior a 0
        setInitialValue(productInfo.length + 1)
      } else if (initialValue == initialValue){
        setInitialValue(productInfo.length + 1)
      }
  }

  const removeProductFromCheckOut = (item) => { // função que permite remover o produto do saco de compras 
   let itemId = item.target.id
    setProductInfo(productInfo.filter(product => product.id !== itemId))
    setInitialValue(productInfo.length - 1)
  }

  const increaseQuantity = (product) => { // função que permite aumentar a quantidade do produto selecionado 
      setQuantity(product.quantity += 1)
  }

  const decreaseQuantity = (product) => { // função que permite diminuir a quantidade do produto selecionado com a condição que quando a quantidade for igual a 1, manter o valor a 1
    if(product.quantity > 1) {
      setQuantity(product.quantity -= 1)
    } else if(product.quantity == 1) {
      setQuantity(1)
    }
  }

  const arrPrice = [] // Array que irá armazenar o preço de todos os produtos selecionados através do map(abaixo)

  productInfo.map(product => arrPrice.push(product.price * product.quantity))

  function getTotal(total, price) { // função que realiza a soma entre o total(representa o valor inicial(variavel total) ou o valor retornado anteriormente da função) e o preço(valor do preço do produto selecionado)
    return total + price
  }

 const total = arrPrice.reduce(getTotal, 0) // reduce retorna a soma de todos os elementos do array arrPrice

  
  useEffect(() => { // Recolha de dados da API 
        fetch("https://61e59d49c14c7a0017124d7d.mockapi.io/api/wishCatalog")
        .then((resp) => resp.json())
        .then((data) => {
          setProducts(data)
          setFilterProduct(data)
        })        
    }, []) 
    
  return (
    <BrowserRouter> 
      <Routes>
          <>
            <Route path="/" element= {
                <HomePage
                  initialValue={initialValue}
                  products={products}
                  checked={isChecked}
                  checkBoxOnChange={checkBoxOnChange}
                  getExtras={getExtras}
                  selectedExtra={selectedExtra}
                  modalFirstState={modalFirstState}
                  previousBtn={previousBtn}
                  nextBtn={nextBtn}
                  closeProduct={closeProduct}
                  renderProducts={renderProducts(currentMeals)}
                  renderPageNumbers={renderPageNumbers}
                  product={product}
                  productInfo={productInfo}
                  selectedProducts={() => selectedProduct(product)}
                  removeProductFromCheckOut={(e) => removeProductFromCheckOut(e)}  
                  searchProduct={(e) => searchProduct(e)}  
                  increaseQuantity={increaseQuantity} 
                  decreaseQuantity={decreaseQuantity}      
                />
              }
            />
            <Route path="/CheckOutPage" element={
                <CheckOutPage
                  productInfo={productInfo}
                  removeProductFromCheckOut={(e) => removeProductFromCheckOut(e)}
                  quantity={quantity}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  total={total}
                />
              } 
            />
          </>
      </Routes>
    </BrowserRouter>
  );
}

