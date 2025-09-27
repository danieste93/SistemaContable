import React, { useState, useEffect } from 'react';
import Head from "next/head";
import PantallaPrincipal from '../components/indexcompo/pantallaPrincipal';
import Caracteristicas from '../components/indexcompo/caracteristicas';
import WhyChooseApp from '../components/indexcompo/why';
import FunFactsSection from '../components/indexcompo/funfact';
import AppDownloadSection from '../components/indexcompo/compatibilidad';
import FaqAccordion from '../components/indexcompo/faq';
import PricingComponent from '../components/indexcompo/pricing';
import NewsletterSubscribe from '../components/indexcompo/newletter';

import WhatsappButton from "../components/WhatsappButton";


const Mainpage = () => {
    const [contacto, setContacto] = useState(false);

        return (
                                    <>
                                    <Head>
                                        <link
                                            rel="stylesheet"
                                            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
                                        />
                                    </Head>
                <PantallaPrincipal />
                <Caracteristicas />
                <WhyChooseApp />
                <FunFactsSection/>
                <AppDownloadSection/>
                <FaqAccordion/>
                <PricingComponent/>
                <NewsletterSubscribe/>
                {/* Botón flotante WhatsApp */}
                    <WhatsappButton
                        phone="+593962124673"
                        message="Hola, quiero más información sobre las membresías de Activos.ec"
                        title="Contáctanos por WhatsApp"
                    />
                </>
        )
    

}


export default Mainpage;