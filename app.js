// connects two ProPresenter 6 instances using stage display and remote control protocols
// treats one as master and one as slave
// whatever signal is sent by the master is duplicated and sent to the slave
"use strict";

// ----- SETUP HAPPENS HERE ----------------

// general configuration
const config = require( "./config.js" );

// modules
const { ProController } = require( "./modules/pro.js" );

let masterPC, slavePC;

slavePC = new ProController(
	config.slave.host,
	config.slave.control.password,
	config.slave.control.protocol,
	{
		onupdate: ( data, pro6c ) => {
			console.log( "--------- SLAVE PRO6 CONTROL UPDATE -------------" );
			console.log( data );
		}
	} );

masterPC = new ProController(
	config.master.host,
	config.master.control.password,
	config.master.control.protocol,
	{
		ondata: ( data ) => {
			console.log( "--------- MASTER PRO7 CONTROL DATA -------------" );
			console.log( data );

			switch ( data.action ) {
				case 'presentationTriggerIndex':
					// pro7 needs the request to only be strings for some reason
					data.slideIndex = data.slideIndex.toString();
					if ( slavePC.connected ) slavePC.send( data );
					break;

				default:
					return;
			}
		},
		// onupdate: ( data, pro6c ) => {
		// 	console.log( "--------- MASTER PRO6 CONTROL UPDATE -------------" );
		// 	console.log( data );
		// 	switch ( data.action ) {
		// 		case 'presentationCurrent':
		// 			slavePC.getPresentation( data.presentationName );
		// 			break;
		// 		case 'presentationTriggerIndex':
		// 			slavePC.triggerSlide( data.slideIndex, data.presentationPath );
		// 			break;
		// 	}
		// 	// console.log( pro6c.status );
		// }
	} );

console.log( 'STARTING...' );