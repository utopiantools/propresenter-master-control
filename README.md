This node application duplicates the functionality of the old ProPresenter Master Control module.

It connects to one ProPresenter (6 or 7) instance as the master, and a second one as the slave. It works with versions 6 or 7 as either master or slave.

## Installation

```
git clone https://github.com/jeffmikels/propresenter-master-control.git
cd propresenter-master-control
npm install
```

## Configuration

After installation is complete copy `config.js.example` to `config.js` and edit the file according to your system's needs.

Note: ProPresenter will only open one network port, and the "control" network port takes precedence.

## Setting up ProPresenter for Master/Slave Arrangement

Master control depends on the two instances sharing the same `presentationPath` data. Here's how ProPresenter internally handles presentation paths:

-   Presentations displayed directly from the Library have the full filesystem path as their `presentationPath`. Therefore, unless your master and slave are running with the exact same filesystem layout, you should avoid using presentations that aren't part of a playlist.
-   Playlists are numbered according to sort order. The top playlist in the playlist window is number `0`, and the first presentation in that playlist will be `0:0`. If any playlist item is a playlist folder, the playlists inside the folder will be identified with a dot followed by their index in that folder. That is, if the first playlist item is a folder, the first playlist inside that folder will be `0.0`, and the first presentation in that playlist will be `0.0:0`.

These presentation paths must match between the master and the slave.

However, when the app starts, it will prompt you to select a presentation on the slave instance that will be controlled by the master instance. If you leave it blank, the master will control any slave playlist that matches the `playlistPath` on the master. If you select a playlist at the prompt, all master selections will be routed to that playlist, and to select a different slave playlist, you will need to restart the app.

## Using the App

To run the app, open up a terminal / command window in the folder where this code is stored.

```
node app.js
```

The app will prompt you to select a playlist on the slave machine that will be controlled by the playlist on the master machine. You can leave it blank to allow the master to control any playlist on the slave according to the playlist location of the master.

That's it, whenever a slide is selected in the master instance, a command will be sent to the slave to trigger a slide at the same slide number in the selected playlist path.
