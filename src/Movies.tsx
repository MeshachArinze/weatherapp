import React from "react";
import MenuSection from "./MenuSection";

const Movies: React.FC = () => {
  const getMovies = (): JSX.Element[] => {
    return [
      {
        desc: "A tale of some people watching over a large portion of space.",
        id: 1,
        icon: "fa-solid fa-galaxy",
        image:
          "https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFydmVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        title: "Protectors of the Milky Way",
      },
      {
        desc: "Some people leave their holes to disrupt some things.",
        id: 2,
        icon: "fa-solid fa-hat-wizard",
        image:
          "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bG9yZCUyMG9mJTIwdGhlJTIwcmluZ3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        title: "Hole People",
      },
      {
        desc: "A boy with a dent in his head tries to stop a bad guy. And by bad I mean bad at winning.",
        id: 3,
        icon: "fa-solid fa-broom-ball",
        image:
          "https://images.unsplash.com/photo-1632266484284-a11d9e3a460a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhcnJ5JTIwcG90dGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        title: "Pot of Hair",
      },
      {
        desc: "A long drawn out story of some people fighting over some space. Cuz there isn't enough of it.",
        id: 4,
        icon: "fa-solid fa-starship-freighter",
        image:
          "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3RhciUyMHdhcnN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        title: "Area Fights",
      },
    ].map((movie: any) => {
      const styles: React.CSSProperties = {
        backgroundImage: `url(${movie.image})`,
      };

      const id: string = `movie-card-${movie.id}`;

      return (
        <div key={movie.id} id={id} className="movie-card">
          <div
            className="movie-card-background background-image"
            style={styles}
          />
          <div className="movie-card-content">
            <div className="movie-card-info">
              <span className="movie-card-title">{movie.title}</span>
              <span className="movie-card-desc">{movie.desc}</span>
            </div>
            <i className={movie.icon} />
          </div>
        </div>
      );
    });
  };

  return (
    <MenuSection
      icon="fa-solid fa-camera-movie"
      id="movies-section"
      scrollable
      title="Popcorn time!"
    >
      {getMovies()}
    </MenuSection>
  );
};

export default Movies;