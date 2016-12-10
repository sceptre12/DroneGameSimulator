#Drone Game Simulator

The purpose of this game is to simulate how one would go about Programmatically controlling a swarm of drones.
Purchasing a programable drone can cost you between $200 to $1000. Since money doesn't grow on trees, I created
this program to be able to understand the complexities one would face when trying to control a swarm of drones.

##Plan Of Action
- Create Interface and layout for the project (Current Stage)
- Create a Command Controller (basically an input area where you can enter commands to control each drone) (Current Stage).
- Give the user the Ability to create more drones (Next Stage)
- Create the run automation script (the code that executes the command that was given by the user) (Next Stage).
- Create a visual graph displaying the all of the drones command path (Next Stage).
    - This graph will allow the users to see full color coded paths the drones will take .
    - If the path will result in a drone crashing into another drone, The program will rerun, Choosing an alternate route
- Create an algorithm that will allow the drones to learn from their mistakes and improve their positions so that on each
    run the drone is capable of taking a better route to reach its destination (Next Stage).


##Install
~~~
npm install
~~~

##Run
~~~
npm run start
~~~
Navigate to the url: http://localhost:8080/#/
