// connects two ProPresenter 6 instances using stage display and remote control protocols
// treats one as master and one as slave
// whatever signal is sent by the master is duplicated and sent to the slave
"use strict";

// ----- SETUP HAPPENS HERE ----------------

// general configuration
const config = require( "./config.js" );

// modules
const { ProControlClient } = require( "propresenter" );

// prepare to get user input
const prompt = require( 'prompt' );

let masterPC, slavePC;
let slavePlaylistPath = '';
let slavePlaylistName = '';
let starting = true;
let pauseOutput = false;

async function selectPlaylist( playlists ) {
	if ( playlists ) {
		console.log( '-- SELECT THE SLAVE PLAYLIST TO CONTROL --' );
		let selected = '';
		let selectedPath = [];

		prompt.start();
		prompt.message = 'Select a playlist';

		while ( true ) {
			// output only one layer of playlist items
			let index = 1;
			for ( let item of playlists ) {
				console.log( `${index++}. ${item.playlistName}` )
			}
			console.log( '===============================' );
			let answer = await prompt.get( [ 'number' ] );
			if ( answer == '' ) return '';
			index = parseInt( answer.number ) - 1;
			selected = playlists[ index ];
			selectedPath.push( selected.playlistName );
			if ( selected.playlistType == 'playlistTypePlaylist' ) {
				slavePlaylistName = selectedPath.join( '/' );
				console.log( `SLAVE PLAYLIST SET TO: ${slavePlaylistName}` );
				return selected.playlistLocation;
			} else {
				playlists = selected.playlist;
			}
		}
	}
}

function print( s ) {
	if ( pauseOutput ) return;
	console.log( s );
}

slavePC = new ProControlClient(
	config.slave.host,
	config.slave.control.password,
	{
		version: config.slave.version,
		onupdate: async ( data, procc ) => {
			// print( "--------- SLAVE CONTROL UPDATE -------------" );
			// print(data);
			if ( data.action == 'playlistRequestAll' && starting ) {
				if ( procc.playlists && procc.playlists.length > 1 ) {
					pauseOutput = true;
					slavePlaylistPath = await selectPlaylist( procc.playlists );
					pauseOutput = false;
				}
				starting == false;
			}
		}
	} );

masterPC = new ProControlClient(
	config.master.host,
	config.master.control.password,
	{
		version: config.master.version,
		ondata: ( data ) => {

			switch ( data.action ) {
				case 'presentationTriggerIndex':
					print( "--------- MASTER CONTROL DATA -------------" );
					print( data );
					// pro7 needs the request to only be strings for some reason
					data.slideIndex = data.slideIndex.toString();

					// if we are specifying a custom target playlist use it here
					if ( slavePlaylistPath != '' ) {
						let presentationIndex = data.presentationPath.split( ':' ).slice( -1 );
						data.presentationPath = `${slavePlaylistPath}:${presentationIndex}`
					};
					print( `sending to slave playlist: ${slavePlaylistName}` )
					print( data );
					if ( slavePC.connected ) slavePC.send( data );
					break;

				default:
					return;
			}
		},
	} );

console.log( 'STARTING...' );