import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, cognome, numeroTessera, email, dataNascita } = body;

   
    if (!nome || !cognome || !numeroTessera || !email || !dataNascita) {
      return NextResponse.json(
        { success: false, message: 'Tutti i campi sono obbligatori.' },
        { status: 400 }
      );
    }

  
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!dateRegex.test(dataNascita)) {
      return NextResponse.json(
        { success: false, message: 'La data di nascita deve essere nel formato dd-mm-aaaa.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER, 
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD, 
      },
    });

    const cardHtml = `
<div style="width: 100%; max-width: 300px; background-color: black; border: 2px solid #ff5722; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: auto; padding: 20px;">
  <!-- Logo con sfondo arancione -->
  <div style="text-align: center; background-color: #ff5722; padding: 10px; border-radius: 10px; margin-bottom: 20px;">
    <img src="https://i.ibb.co/rwzShSt/app-logo-orizzontale.png" alt="Logo" style="width: 150px; height: auto; display: block; margin: 0 auto;">
  </div>

  <!-- Dati socio -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
    <div style="flex: 1;">
      <p style="font-size: 14px; color: white; margin: 0;"><strong>Nome:</strong> ${nome}</p>
      <p style="font-size: 14px; color: white; margin: 0;"><strong>Cognome:</strong> ${cognome}</p>
      <p style="font-size: 14px; color: white; margin: 0;"><strong>Data di Nascita:</strong> ${dataNascita}</p>
    </div>
  </div>

  <!-- Numero tessera -->
  <div style="text-align: center; background-color: #ff5722; color: white; padding: 10px 20px; border-radius: 10px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
    <p style="margin: 0;">Numero tessera: ${numeroTessera}</p>
  </div>
</div>
    `;

    const mailOptions = {
      from: `"Associazione" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`, 
      to: email, 
      subject: 'La tua tessera socio digitale',
      html: cardHtml, 
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email inviata:', info.messageId);

    return NextResponse.json(
      { success: true, message: 'Email inviata con successo!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'invio dell\'email.' },
      { status: 500 }
    );
  }
}
