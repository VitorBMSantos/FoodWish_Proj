import React, { useEffect, useState } from 'react'
import './main.css'
import CatalogPage from '../../ReusableComponents/CatalogComp/CatalogPage'


export default function Main(props) {

    // Este componente é o que suporta os componentes catalogPage e modalComp
    
     return (
         <div className="catalogContainer relative" id="main">
            <CatalogPage
                products={props.products}
                checked={props.isChecked}
                checkBoxOnChange={props.checkBoxOnChange}
                saveUserExtras={props.saveUserExtras}
                getExtras={props.getExtras}
                modalFirstState={props.modalFirstState}
                renderProducts={props.renderProducts}
                previousBtn={props.previousBtn}
                nextBtn={props.nextBtn}
                renderPageNumbers={props.renderPageNumbers}
                product={props.product}
                closeProduct={props.closeProduct}
                openProduct={props.openProduct}
                currentMeals={props.currentMeals}
                selectedProducts={props.selectedProducts}
                stock={props.stock}
            />
         </div>
     )
}
