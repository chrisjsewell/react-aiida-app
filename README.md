# react-aiida-app

[![Github-CI][github-ci]][github-link]
[![Coverage Status][codecov-badge]][codecov-link]

This project is a continuation of [jlab_aiidatree](https://github.com/chrisjsewell/jlab_aiidatree),
in which we built a working prototype for a JupyterLab extension to interact with AiiDA.

Some cool features:

- Responsive layout grid that adapts to window size
- Persistence of key input fields in-between page changes, refreshes and multiple sessions
- Paginated and cached data queries

During development of `jlab_aiidatree` it was noted that you can embed [React components](https://reactjs.org/) inside of JupyterLab (see [JupyterLab/React](https://jupyterlab.readthedocs.io/en/stable/extension/virtualdom.html)).

The goal, therefore, is that we can develop this package as a standalone app
(which could also be utilised directly via a web server),
but also use it as a dependency to generate most of the JupyterLab extension, via React components.

The benefit of also using th app within JupyterLab, is:

1. It provides a platform within which to run the app locally, without having to host it directly
2. It allows us an alternate route to interface with AiiDA:
   via the "private" REST API interface between the JupyterLab backend and frontend.
   Using this REST API, will allow us easy access to parts of the AiiDA API that are yet to be exposed in REST, whilst maintaining that formal protocol (enforcing separation of concerns).
   We can then use this to essentially prototype additions to the AiiDA REST API.
3. It provides the possible to integrate with other aspects of the Jupyter framework (e.g. Notebooks)

## About React

React is an industry leading library, for creating beautiful and responsive UIs,
maintained by Facebook and with users including Whatsapp, Dropbox, Uber and Netflix.
We also utilise other "best-practice" React components:

- [Material-UI](https://material-ui.com): A React component library that implements Google’s [Material Design guidelines](https://material.io/design)
- [react-query](https://react-query.tanstack.com/): A React component for synchronizing server data (from AiiDA) with the UI.

React itself is really user-friendly to get started with, even with only a small familiarity with HTML and JavaScript, see <https://reactjs.org/tutorial/tutorial.html>.
Once learned, it is also incredibly intuitive to generate web elements with, using the [`.jsx` file format](https://reactjs.org/docs/introducing-jsx.html).
For example a simple React component would look like:

```jsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <p>Here is a dynamic value: {props.value}</p>
    </div>
  )
}
```

## This app vs Materials Cloud Explore

**Update:** Materials Cloud is in fact looking to move to React

Note, initial features of this app are quite similar to <https://www.materialscloud.org/explore/connect>: using the AiiDA REST API as a backend for visualising its data.
However, this is built with <https://angularjs.org/> which, although also well used in industry, has two major drawbacks for our use case:

1. You cannot integrate it with JupyterLab (see benefits above)
2. It does not have the re-usable component infrastructure of React, which should allow us to eventually build an extensible app with "pluggable" extensions.

## This app vs AiiDALab

[AiiDALab](https://www.materialscloud.org/work/aiidalab) uses the Jupyter Notebook server to build its frontend, via [ipywidgets](https://ipywidgets.readthedocs.io), which dynamically generates the HTML/Javascript from python code cells, and appmode/voila which executes the Notebook on page load, then converts the notebook interface to look more like a web app (hiding code cells, etc).
Note, despite its name, it does not use JupyterLab per se.

The benefits of this approach, is that:

1. You can code everything in Python/Jupyter Notebooks, which is obviously the background of many working on AiiDA (being a Python package), albeit that, if you want to do anything substantial with these apps you inevitably have to learn some HTML/JavaScript.
2. You can interface directly with the AiiDA Python API

The disadvantage though is that the apps which it creates are substantially limited in the user interfaces (UI) and user experience (UX) they can create.

1. On every page load you need to first execute the notebook, then render it, meaning loads times are extremely poor by web standards.
2. You are restricted by the semantics/layout of the Notebook, i.e. each app has to be a set of separate pages and in each page you have a set of vertically sequential cells.
3. You are restricted by the semantics/functionality of ipywidgets, by industry standard, a very niche/bespoke tool.
   In practice, you end up taking a lot of time to learn/create a lot of HTML widgets that have little to no practical reusability, rather than being able to utilise the massive React ecosystem of libraries and components.

[github-ci]: https://github.com/chrisjsewell/react-aiida-app/workflows/CI/badge.svg?branch=master
[github-link]: https://github.com/chrisjsewell/react-aiida-app
[codecov-badge]: https://codecov.io/gh/chrisjsewell/react-aiida-app/branch/master/graph/badge.svg
[codecov-link]: https://codecov.io/gh/chrisjsewell/react-aiida-app

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

### Deployment of test server

I have deployed an example AiiDA REST Server on AWS: <http://15.188.110.176:5000/api/v4>:

1. Select an Ubuntu 20.04 EC2 Instance (since we need python>=3.7)
2. Allow inbound traffic on port: `5000` and `22`, protocol: `TCP`, source: `0.0.0.0/0, ::/0`
3. Set up an elastic IP
4. SSH into the instance:

```console
$ sudo apt update
$ sudo apt install python3-venv postgresql postgresql-server-dev-all postgresql-client
$ python3 -m pip venv venv
$ source venv/bin/activate
$ pip install -U pip wheel
$ pip install aiida-core[rest]~=1.6.3
$ verdi quicksetup
...
$ verdi archive import "https://archive.materialscloud.org/record/file?filename=HiCond_bands_calculations.aiida&file_id=ee287780-ac04-4b8b-b03c-3cea6e446f9d&record_id=477"
$ verdi archive import "https://archive.materialscloud.org/record/file?filename=HiCond_AuIh.aiida&file_id=8bb2d7d9-384b-4bdc-b917-76fa02fbd497&record_id=477"
```

You can then directly test access to the server:

```bash
$ verdi restapi -H 0.0.0.0 -P 5000
```

But, for reliability, we can set up a service to ensure it gets reloaded on any failures:

```console
$ sudo vi /etc/systemd/system/aiidarest.service
[Unit]
Description=AiiDA REST API service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/home/ubuntu/venv/bin/verdi restapi -H 0.0.0.0 -P 5000
Restart=always

[Install]
WantedBy=multi-user.target

$ sudo systemctl daemon-reload
$ sudo systemctl start aiidarest
$ sudo systemctl enable aiidarest
```

**NOTE** I had to patch `venv/lib/python3.8/site-packages/aiida/restapi/run_api.py` to add `ssl_context='adhoc'` (see https://blog.miguelgrinberg.com/post/running-your-flask-application-over-https)

**TODO:** How to properly set up this as a production server?
(see e.g., <https://medium.com/techfront/step-by-step-visual-guide-on-deploying-a-flask-application-on-aws-ec2-8e3e8b82c4f7>, <https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uswgi-and-nginx-on-ubuntu-18-04>)

### TODO

- Create demonstration server deployment

- Improve package build/packaging tooling for use as module in JupyterLab:
  - Currently I'm just copying the `.ts[x]` files into the JupyterLab `src/reactApp` folder and that works, but like to have it as a seperate module for install from npm.
  - the react-app packages the app to be run as a standalone web-site and so (a) includes all the types and testing libraries in dependencies (see <https://github.com/facebook/create-react-app/issues/6180>)  (b) does not compile the JS into a place that is automatically used by `npm publish` (i.e. installing from npm does not give you the package as a module)
  - also there is no prettier configuration for formatting and the eslint seems quite permissive
  - See: <https://reactjs.org/docs/code-splitting.html>
  - Need to eject project? See: <https://medium.com/curated-by-versett/dont-eject-your-create-react-app-b123c5247741>
  - For moving packages, see: <https://stackoverflow.com/questions/18875674/whats-the-difference-between-dependencies-devdependencies-and-peerdependencies/22004559#22004559>
  - alternatively, could create a separate package to house the reusable components
  - Used: https://brygrill.medium.com/create-react-app-with-typescript-eslint-prettier-and-github-actions-f3ce6a571c97

- material-ui `Drawer` is not (automatically) compatible with JupyterLab extension, where it needs to be constrained within the extension window (see <https://github.com/mui-org/material-ui/issues/11749> for potential fixes)

- Add a plugin system for adding additional pages
  - Ideally it would work like Python entry points, with the core app requiring no knowledge of the extensions: <https://stackoverflow.com/questions/67562146/javascript-typescript-equivalent-of-python-entry-points-for-plugin-system>
  - Possibly it is not available by default, and you have to search the node modules yourself (but will this work in jupyter extension). See <https://github.com/flowscripter/esm-dynamic-plugins/blob/master/src/repository/NodeModulesPluginRepository.tsx>

### Provenance Graph Visualisation

What library to use?

As discussed [here](https://dev.to/timlrx/a-comparison-of-javascript-graph-network-visualisation-libraries-34a8), there are a number of libraries available, with three primary factors:

- Rendering Engine: WebGL is more performant, but can be more difficult to work with.
- Algorithms: Available APIs to perform graph operations
- Components: Out-of-the-box UI components

Library | Licence | Rendering Engine | Algorithms | Components | TypeScript | NPM Downloads
------- | ------- | ---------------- | ---------- | ---------- | ------- | -------
D3 | BSD | SVG / Canvas | Low | Low
Keylines | Commercial | Canvas / WebGL | High | Medium
Vis.js | MIT | Canvas | Middle | Low
Sigma.js | MIT | Canvas / WebGL | Middle | Low
Ogma | Commercial | Canvas / WebGL | High | Low
[G6](https://g6.antv.vision/) | MIT | Canvas | High | High | yes | 3,737
Ngraph | MIT | WebGL | Middle | Low
[React-force-graph](https://github.com/vasturiano/react-force-graph) | MIT | Canvas (2D) / WebGL (3D) | Low | Low | yes | 27,868
react-tree-graph | MIT | SVG | Low | Low

For initial development I have chosen [React-force-graph](https://github.com/vasturiano/react-force-graph), since it appeared to have the best initial integration with React and was quite simple.
But G6 may be better for a more complete solution?

Development:

- Currently I have had to add a patch to the install, to make it compatible with the `bezier-js` dependency, see: <https://github.com/vasturiano/react-force-graph/issues/282>
- `react-sizeme` is required to get the graph to be constrained to the size of the grid that it is in.


### Structure Visualisation

- Looks good but https://github.com/3dmol/3Dmol.js/issues/236 (no typescript)
- https://github.com/lukasturcani/mol-draw uses threejs, very basic, no typescript
- https://www.npmjs.com/package/@react-three/fiber + https://github.com/pmndrs/drei looks to be the way, but will have to build the actual viewer
  - Note: this issue is currently pinning @react-three/drei < 5>: https://github.com/pmndrs/drei/issues/397
  - https://codesandbox.io/s/r3f-multi-view-mdnhl?file=/src/index.js:155-163

### Charts Visualisation

To eventually visualise output data node.

- https://openbase.com/categories/js/best-react-chart-libraries?orderBy=RECOMMENDED&
- https://recharts.org

resisizing:

https://stackoverflow.com/a/54841876/5033292
https://github.com/react-grid-layout/react-resizable
https://github.com/react-grid-layout/react-draggable
https://github.com/react-grid-layout/react-grid-layout