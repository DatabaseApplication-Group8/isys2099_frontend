import React from 'react';
import Header from '@/components/Header/Header';
//import Footer from '@/components/Footer/Footer';


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-grow bg-[#BFD2F8] bg-opacity-[30%] p-8 justify-center items-center">
        <div className='container bg-white p-20 rounded-md max-w-[830px]'>
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to Hospital Management System!</h1>
          <div className="text-lg flex flex-col space-y-3">
            <p>Lecturer: Mr. Tri Dang Tran</p>
            <p>Team Members: <br/>
            Nguyen Anh Duy (s3878141)<br />
            Tran Vu Quang Anh (s3916566)<br />
            Tran Nhat Tien (s3919657)<br />
            Ton Nu Ngoc Khanh (s3932105)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
