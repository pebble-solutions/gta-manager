import { createStore } from 'vuex'

export default createStore({
	state: {
		structures: [],
		activeStructureId: null,
		login: null,
		elements: [],
		openedElement: null,
		tmpElement: null,
		pointageSelected: [],
		personnelsDeclarations: [],
		semaines: []
	},
	getters: {
		activeStructure(state) {
			return state.structures.find(e => e.id === state.activeStructureId);
		}
	},
	mutations: {
		/**
		 * Charge un objet dans openedElement
		 * @param {Object} state Le state de l'instance VueX
		 * @param {Integer} id L'ID de l'élément à charger
		 */
		open(state, id) {
			state.openedElement = id;
		},


		/**
		 * Ferme l'élément ouvert
		 * @param {Object} state Le state de l'instance VueX
		 */
		close(state) {
			state.openedElement = null;
		},

		/**
		 * Remplace la liste des éléments chargés avec une nouvelle liste
		 * @param {Object} state		Le state de l'instance VueX
		 * @param {Array} elements		La nouvelle liste d'éléments
		 */
		replaceElements(state, elements) {
			state.elements = elements;
		},

		/**
		 * Rafraichie la liste des éléments chargés à partir d'une autre liste.
		 * - si un élément existe dans state et dans elements, il est actualisé avec le nouveau
		 * - si un élément est dans elements mais pas dans state, il est ajouté
		 * @param {Object} state		Le state de l'instance VueX
		 * @param {Array} elements		La nouvelle liste d'éléments
		 */
		updateElements(state, elements) {
			elements.forEach(element => {
				let stateEl = state.elements.find(e => e.id === element.id);

				// Mise à jour d'un élément existant
				if (stateEl) {
					for (let key in element) {
						stateEl[key] = element[key];
					}
				}
				// Ajout d'un élément existant
				else {
					state.elements.push(element);
				}
			});
		},

		/**
		 * Retire des éléments de la liste des éléments chargés
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} elements Les ID des éléments à retirer
		 */
		removeElements(state, elements) {
			elements.forEach(id => {
				let index = state.elements.findIndex(e => e.id === id);

				if (index !== -1) {
					state.elements.splice(index, 1);
				}
			});
		},

		/**
		 * Met à jour les données de l'élément chargé
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Liste clé valeur des infos à mettre à jour
		 */
		updateOpened(state, data) {
			for (let key in data) {
				state.openedElement[key] = data[key];
			}
		},

		/**
		 * Enregistre le login dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} login L'objet Login
		 */
		setLogin(state, login) {
			state.login = login;
		},

		/**
		 * Enregistre les structures chargées dans le store
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Array} structures La liste des structures
		 */
		setStructures(state, structures) {
			state.structures = structures;
		},

		/**
		 * Enregistre une donnée dubliqué de openedElement
		 * @param {Object} state Le state de l'instance vueX
		 * @param {Object} data Un objet identique à la structure de openedElement
		 */
		tmpElement(state, data) {
			state.tmpElement = data;
		},

		/**
		 * Enregistre la structure active dans le store
		 * @param {Object} state Le state de vueX
		 * @param {Integer} structureId L'id de la structure à activer
		 */
		setStructureId(state, structureId) {
			state.activeStructureId = structureId;
		},

		/**
		 * Ajout ou retire un pointage du tableau  pointageSelected
		 * @param {Object} state le state de l'instance vuex
		 * @param {Object} optionsPointage 
		 * 		- pointage {Object}		le pointage selectionné
		 * 		- action {String}		l'action a faire sur le tableau, ajouter/retirer/reset
		 */
		pointage_selected(state, optionsPointage) {
			if(optionsPointage.action == 'add') {
				state.pointageSelected.push(optionsPointage.pointage);
			} else if (optionsPointage.action == 'remove') {
				let index = state.pointageSelected.findIndex(p => p.id === optionsPointage.pointage.id);

				if(index !== -1) {
					state.pointageSelected.splice(index, 1);
				}
			} else {
				state.pointageSelected = [];
			}
		},

		/**
		 * Ajout ou retire un personnels declarations (personnel qui contient gta_declaration et structure temps declarations) du tableau  personnelsDeclarations
		 * @param {Object} state le state de l'instance vuex
		 * @param {Object} optionsPersonnels 
		 * 		- personnel {Object}		le personnel qui a un pointage dans la semaine selectionnée
		 * 		- personnels {Array}		une liste de personnels sur lesquels réaliser l'action
		 * 		- action {String}			l'action a faire sur le tableau, add/remove/reset/refresh
		 */
		personnels_declaration(state, optionsPersonnels) {
			let personnels = optionsPersonnels.personnel ? [optionsPersonnels.personnel] : optionsPersonnels.personnels;

			if(optionsPersonnels.action == 'add') {
				personnels.forEach(personnel => {
					state.personnelsDeclarations.push(personnel);
				})
			} else if (optionsPersonnels.action == 'remove') {
				personnels.forEach(personnel => {
					let index = state.personnelsDeclarations.findIndex(p => p.id === personnel.id);

					if(index !== -1) {
						state.personnelsDeclarations.splice(index, 1);
					}
				});
			} 
			else if (optionsPersonnels.action == 'refresh') {
				personnels.forEach(personnel => {
					let index = state.personnelsDeclarations.findIndex(p => p.id === personnel.id);

					if (index !== -1) {
						for (const key in personnel) {
							state.personnelsDeclarations[index][key] = personnel[key];
						}
					}
				});
			}
			else {
				state.personnelsDeclarations = [];
			}
		},

		/**
		 * Met à jour des GtaPeriodes sur le personnel stocké dans le store. Si la GtaPeriode n'existe pas 
		 * sur le personnel, elle est ajouter grâce au structure__personnel_id
		 * @param {Object} state Le state de VueX
		 * @param {Array} gta_periodes Collection de gta_periodes à mettre à jour
		 */
		personnel_gta_periodes(state, gta_periodes) {
			gta_periodes.forEach(GtaPeriode => {
				let personnel = state.personnelsDeclarations.find(e => e.id === GtaPeriode.structure__personnel_id);

				if (personnel) {
					let periode = personnel.gta_periodes.find(e => e.id === GtaPeriode.id);


					if (periode) {
						for (const key in GtaPeriode) {
							periode[key] = GtaPeriode[key];
						}
					}
					else {
						personnel.gta_periodes.push(GtaPeriode);
					}
				}
			});
		},

		/**
		 * Rempplace, ajoute a la fin ou au debut du tableau les semaines analytics
		 * @param {Object} state Le state de vueX
		 * @param {Array} optionsSemaines 
		 * 		- semaines {Array}			Collection de semaines analytics
		 * 		- action {String} 			Action a faire sur le tableau Ajout au debut ou a la fin / remplace
		 */
		setSemaines(state, optionsSemaines) {
			if(optionsSemaines.action == "addStart") {
				for (let index in optionsSemaines.semaines) {
					state.semaines.unshift(optionsSemaines.semaines[index]);
				}
			} else if (optionsSemaines.action == 'addEnd'){
				for (let index in optionsSemaines.semaines) {
					state.semaines.push(optionsSemaines.semaines[index]);
				}
			} else {
				if(state.semaines.length > 0) {
					for (let index in optionsSemaines.semaines) {
						let findIndex = state.semaines.findIndex(s => s.week == optionsSemaines.semaines[index].week);
	
						if(findIndex > -1) {
							state.semaines[findIndex] = optionsSemaines.semaines[index];
						}
					}
				} else {
					state.semaines = optionsSemaines.semaines
				}
			}
		}
	},
	actions: {
		/**
		 * Charge un élément depuis le store via son ID
		 * @param {Object} context Instance VueX
		 * @param {Integer} elementId Id de l'élément à charger depuis les éléments existants ou depuis l'API
		 */
		load(context, elementId) {
			let el = context.state.elements.find(e => e.id == elementId);

			if (el) {
				context.commit('open', el);
			}
			else {
				// Il faut générer une requête pour charger l'élément manquant
				console.log('Not found');
			}
		},

		/**
		 * Ferme l'élément ouvert
		 * @param {Object} context Instance VueX
		 */
		unload(context) {
			context.commit('close');
		},

		/**
		 * Met à jour la liste des éléments chargés
		 * @param {Object} context L'instance VueX
		 * @param {Object} payload Les paramètres de rafraichissement
		 * - action			update (default), replace, remove
		 * - elements		la liste des éléments
		 */
		refreshElements(context, payload) {
			if (!('action' in payload)) {
				payload.action = 'update';
			}

			if (payload.action == 'update') {
				context.commit('updateElements', payload.elements);
			}
			else if (payload.action == 'replace') {
				context.commit('replaceElements', payload.elements);
			}
			else if (payload.action == 'remove') {
				context.commit('removeElements', payload.elements);
			}
			else {
				throw new Error(`La mutation ${payload.action} n'existe pas.`);
			}
		},

		/**
		 * Met à jour les infos de l'élément ouvert avec des données
		 * @param {Object} context L'instance vueX
		 * @param {Object} data Liste clé valeur des informations à mettre à jour
		 */
		refreshOpened(context, data) {
			context.commit('updateOpened', data);
		},

		/**
		 * Enregistre l'ouverture d'une session
		 * @param {Object} context L'instance vueX
		 * @param {Object} payload Un objet contenant une clé login et une clé structure
		 */
		login(context, payload) {
			context.commit('setLogin', payload.login);
			context.commit('setStructures', payload.structures);
		},

		/**
		 * Enregistre la fermeture d'une session
		 * @param {Object} context L'instance vueX
		 */
		logout(context) {
			context.commit('setLogin', null);
			context.commit('setStructures', []);
		},

		/**
		 * Bascule sur une structure
		 * @param {Object} context L'instance vueX
		 * @param {Integer} payload L'ID de la structure active
		 */
		switchStructure(context, payload) {
			context.commit('close');
			context.commit('tmpElement', null);
			context.commit('replaceElements', []);
			context.commit('setStructureId', payload);
		},

		/**
		 * Ajout un pointage a la liste des pointages sélectionnés
		 * @param {Object} context Instance vuex
		 * @param {Object} pointage pointage a ajouter
		 */
		addPointage(context, pointage) {
			context.commit('pointage_selected', {pointage, action : 'add'});
		},

		/**
		 * Remove un pointage a la liste des pointages sélectionnés
		 * @param {Object} context Instance vRemove	 
		 * @param {Object} pointage pointage a ajouter
		 */
		removePointage(context, pointage) {
			context.commit('pointage_selected', {pointage, action : 'remove'});
		},

		/**
		 * Remove un pointage a la liste des pointages sélectionnés
		 * @param {Object} context Instance vRemove	 
		 */
		resetPointage(context) {
			context.commit('pointage_selected', {action : 'reset'});
		}, 

		/**
		 * Ajout un personnel a la liste des personnel declaration
		 * @param {Object} context Instance vuex
		 * @param {Object} personnel personnel a ajouter
		 */
		addPersonnel(context, personnel) {
			context.commit('personnels_declaration', {personnel, action : 'add'});
		},

		/**
		 * Remove un personnel a la liste des personnels declaration
		 * @param {Object} context Instance vRemove	 
		 * @param {Object} personnel personnel a ajouter
		 */
		removePersonnel(context, personnel) {
			context.commit('personnels_declaration', {personnel, action : 'remove'});
		},

		/**
		 * Remove un personnel a la liste des personnels declaration
		 * @param {Object} context Instance vRemove	 
		 */
		resetPersonnel(context) {
			context.commit('personnels_declaration', {action : 'reset'});
		},

		/**
		 * Met à jour les informations d'un ou plusieurs personnels
		 * @param {Object} context Instance VueX
		 * @param {Array} personnels Collection de personnels à mettre à jour
		 */
		refreshPersonnel(context, personnels) {
			context.commit('personnels_declaration', {personnels, action : 'refresh'});
		},


		/**
		 * Met à jour des gta_periodes sur la collection de personnels stockée dans le store
		 * @param {Object} context Instance VueX
		 * @param {Array} gta_periodes Collection de Gta Periodes
		 */
		refreshPersonnelGtaPeriodes(context, gta_periodes) {
			context.commit('personnel_gta_periodes', gta_periodes);
		},

		/**
		 * Ajout au debut ou a la fin du tableau semaines en fonction de l'action défini
		 * @param {Object} context Instance vueX
		 * @param {Array} payload 
		 * 		- action	addStart , addEnd
		 * 		- semaines	Liste des semaine a ajouter
		 */
		addSemaines(context, payload) {
			let semaines = payload.semaines;

			if(payload.action === 'addStart') {
				context.commit('setSemaines', {semaines, action : 'addStart'});
			} else if(payload.action === 'addEnd') {
				context.commit('setSemaines', {semaines, action : 'addEnd'});
			} else {
				throw new Error(`La mutation ${payload.action} n'existe pas.`);
			}
		},

		/**
		 * Met à jour semaines
		 * @param {Object} context Instance VueX
		 * @param {Array} semaines Collection de semaines analytics
		 */
		refreshSemaines(context, semaines) {
			context.commit('setSemaines', {semaines, action : 'refresh'})
		}

	},
	modules: {
	}
})
