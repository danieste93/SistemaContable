import React, { useState, useEffect } from 'react';
import PantallaPrincipal from '../components/indexcompo/PantallaPrincipal';
import Caracteristicas from '../components/indexcompo/caracteristicas';
import WhyChooseApp from '../components/indexcompo/why';
import FunFactsSection from '../components/indexcompo/funfact';
import AppDownloadSection from '../components/indexcompo/compatibilidad';
import FaqAccordion from '../components/indexcompo/faq';
import PricingComponent from '../components/indexcompo/pricing';
import NewsletterSubscribe from '../components/indexcompo/newletter';


const Mainpage = () => {
    const [contacto, setContacto] = useState(false);

    return (
        <>
        <PantallaPrincipal />
        <Caracteristicas />
        <WhyChooseApp />
        <FunFactsSection/>
        <AppDownloadSection/>
        <FaqAccordion/>
        <PricingComponent/>
        <NewsletterSubscribe/>
        </>
    )
    

}


export default Mainpage;