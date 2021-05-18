# react-aiida-app

This project is a continuation of [jlab_aiidatree](https://github.com/chrisjsewell/jlab_aiidatree),
in which we built a working prototype for a JupyterLab extension.

During this development it was noted that you can embed [React components](https://reactjs.org/) inside of JupyterLab (see [JupyterLab/React](https://jupyterlab.readthedocs.io/en/stable/extension/virtualdom.html)).

The hope, therefore, is that we can develop this package as a standalone app
(which could can used utilised directly via a web server),
but also use it as a dependency to generate most of the JupyterLab extension, via React components.

React is an industry leading library, for creating beautiful and responsive UIs,
maintained by Facebook and with users including Whatsapp, Dropbox and Netflix.
We also utilise other "best-practice" React components:

- [Material-UI](https://material-ui.com): A React component library that implements Google’s [Material Design guidelines](https://material.io/design)
- [react-query](https://react-query.tanstack.com/): A React component for synchronizing server data (from AiiDA) with the UI.

The benefit of also using JupyterLab, is (a) it provides a framework within which to run the app,
and (b) it allows us an alternate route to interface with AiiDA:
via the "private" REST API interface between the JupyterLab backend and frontend.

Using this REST API, will allow us easy access to parts of the AiiDA API that are yet to be exposed in REST, whilst maintaining that formal protocol (enforcing separation of concerns).
We can then use this to essentially prototype additions to the AiiDA REST API.

## Project initialisation with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Development Notes

### Initial creation of the app

cd ~/Documents/GitHub
(install nodejs)
npx create-react-app react-aiida-app --template typescript
cd react-aiida-app
(see https://stackoverflow.com/a/39604469/5033292 for having code available in PATH)
code .
npm start

### Creating an AiiDA REST API test server

docker run -d -p 5001:5001 --name react-aiida-app aiidateam/aiida-core:1.6.3
docker exec -t react-aiida-app wait-for-services

In other tab, as root:

docker exec -it react-aiida-app bash
conda install flask-cors~=3.0 flask-restful~=0.3.7 flask~=1.1 pyparsing~=2.4 python-memcached~=1.59

Then with user:

docker exec -it --user aiida react-aiida-app bash

Too big for container import:
verdi archive import "https://archive.materialscloud.org/record/file?filename=two_dimensional_database.aiida&file_id=98f1789b-d68e-46db-9c67-4ef8dd8c1ebf&record_id=648"
verdi archive import "https://archive.materialscloud.org/record/file?filename=export_pyrene_mofs_22Sep20.aiida&file_id=7e0556c8-f3b2-4759-9966-7d8efa22e13b&record_id=649"

Good: https://archive.materialscloud.org/record/2020.87
verdi archive import "https://archive.materialscloud.org/record/file?filename=HiCond_bands_calculations.aiida&file_id=ee287780-ac04-4b8b-b03c-3cea6e446f9d&record_id=477"
verdi archive import "https://archive.materialscloud.org/record/file?filename=HiCond_AuIh.aiida&file_id=8bb2d7d9-384b-4bdc-b917-76fa02fbd497&record_id=477"

verdi -p default restapi -P 5001 -H 0.0.0.0
