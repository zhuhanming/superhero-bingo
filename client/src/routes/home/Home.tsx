import React from 'react';

import Koala from 'assets/svgr/Koala';
import PageTitle from 'assets/svgr/PageTitle';
import Panda from 'assets/svgr/Panda';

const Home: React.FC = () => {
  return (
    <main className="w-full flex flex-col items-center">
      <PageTitle className="w-full md:w-1/2 max-w-xs transform transition duration-500 hover:scale-105" />
      <section className="mt-8 md:px-8 text-center">
        <p className="text-xl font-medium">
          How well do you know your friends? Find out now using our Superhero
          Bingo!
        </p>
      </section>
      <section className="flex flex-col md:flex-row md:px-8 justify-around w-full flex-wrap">
        <button
          type="button"
          className="flex flex-col items-center justify-center md:flex-1 h-96 bg-blue mt-8 md:mr-8 p-8 rounded-3xl border-black border-12 transform transition duration-500 hover:scale-105 shadow-lg"
        >
          <Koala />
          <p className="text-5xl mt-8 font-bold">Create</p>
          <p className="font-regular mt-2">
            Create powers for the superheroes to match!
          </p>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center md:flex-1 h-96 bg-blue mt-8 md:ml-8 p-8 rounded-3xl border-black border-12 transform transition duration-500 hover:scale-105 shadow-lg"
        >
          <Panda />
          <p className="text-5xl mt-8 font-bold">Join</p>
          <p className="font-regular mt-2">
            Join a game to find out your friends&apos; powers!
          </p>
        </button>
      </section>
    </main>
  );
};

export default Home;
