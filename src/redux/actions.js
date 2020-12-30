import axios from "axios";
import firebase from "../firebase/init";
// import { copyContentFromStaging } from "../firebase/operations"
import { NOTIFICATION_MESSAGES } from "../utils/constants";


// AUTHENTICATION ------------------------

export function userLoggedIn(user = null) {
  return { type: "USER_LOGGED_IN", user };
}

export function userLoggedOut() {
  return { type: "USER_LOGGED_OUT" };
}

// NOTIFICATIONS ------------------------

export function showNotification(message, color="success") {
  return { type: "SHOW_NOTIFICATION", message, color };
}

export function closeNotification() {
  return { type: "CLOSE_NOTIFICATION" };
}

export function showNotificationByName(name) {
  return dispatch => {
    const message = NOTIFICATION_MESSAGES[name];
    dispatch( (message, "success"));
  };
}

// PAGE EDITING ------------------------


export function updateSectionContent(sectionIndex, contentIndex, newContent) {
  return {
    type: "UPDATE_SECTION_CONTENT",
    sectionIndex,
    contentIndex,
    newContent
  };
}

export function addSection(sectionIndex, sectionType="default") {
  return { type: "ADD_SECTION", sectionIndex, sectionType };
}

export function duplicateSection(sectionIndex) {
  return { type: "DUPLICATE_SECTION", sectionIndex };
}

export function deleteSection(sectionIndex) {
  return { type: "DELETE_SECTION", sectionIndex };
}

export function addContentItem(sectionIndex, contentType) {
  return { type: "ADD_CONTENT_ITEM", sectionIndex, contentType };
}

export function updateContentItem(sectionIndex, contentIndex, content) {
  return { type: "UPDATE_CONTENT_ITEM", sectionIndex, contentIndex , content};
}

export function deleteContentItem(sectionIndex, contentIndex) {
  return { type: "DELETE_CONTENT_ITEM", sectionIndex, contentIndex };
}

export function toggleEditing() {
  return { type: "TOGGLE_EDITING" };
}

export function toggleNewPageModal(options) {
  return { type: "TOGGLE_NEW_PAGE_MODAL", options };
}

export function updatePageTitle(title) {
  return { type: "UPDATE_PAGE_TITLE", title };
}

export function updatePageHeaderImage(content) {
  return { type: "UPDATE_PAGE_HEADER_IMAGE", content };
}

export function updatePageContentState(location, content) {
  return { type: "UPDATE_PAGE_CONTENT", location, content };
}

export function setPageContentState(location, content) {
  return { type: "SET_PAGE_CONTENT", location, content };
}

export function savePage(pageData, pageId) {
  return dispatch => {
    const db = firebase.firestore();
    db
      .collection('pages')
      .doc(pageId)
      .update(pageData)
      .then(snap => {
        dispatch(toggleNewPageModal());
        dispatch(
          showNotification(
            "Your page has been saved. Publish your changes to view and edit the page.",
            "success"
          )
        );
      });
  };
}


// rename to updateContent
export function updatePageContent(key, newContent) {
  console.log({ [key]: newContent })
  return (dispatch, getState) => {
    const db = firebase.firestore();
    const pageId = getState().page.data.id;
    const content = { ...getState().page.data.content };

    if (!newContent) {
      delete content[key]
    } else {
      content[key] = newContent
    }

    db
      .collection('pages')
      .doc(pageId)
      .update({ content: JSON.stringify(content) })
      .then(res => {
        console.log({ res })
        dispatch(updatePageData(content));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateTitle(title) {
  return (dispatch, getState) => {
    const db = firebase.firestore();
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ title })
      .then(() => {
        dispatch(updatePageTitle(title));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateHeaderImage(content) {
  return (dispatch, getState) => {
    const db = firebase.firestore();
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ headerImage: content })
      .then(() => {
        dispatch(updatePageHeaderImage(content));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function deleteHeaderImage() {
  return (dispatch, getState) => {
    const db = firebase.firestore();
    const FieldValue = firebase.firestore.FieldValue;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ 'content.headerImage': FieldValue.delete() })
      .then(() => {
        dispatch(updatePageHeaderImage({ imageSrc: null, title: null }));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateFirebaseData(updates, callback=null) {
  return (dispatch, getState) => {
    const db = firebase.firestore();
    console.log(updates)

    db.ref().update(updates, error => {
      if (error) {
        console.log('FIREBASE ERROR', error)
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      if (callback) {
        callback()
      }

      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    });
  };
}

export function savePageContent(innerFunction) {
  return (dispatch, getState) => {
    Promise.resolve(dispatch(innerFunction)).then(() => {
      const content = getState().page.data.content;
      const pageId = getState().page.data.id;

      console.log("content", content)
      console.log("pageId", pageId)

      const db = firebase.firestore();

      db.collection('pages')
        .doc(pageId)
        .update({ content })
        .then(res => {
          dispatch(
            showNotification(
              "Your changes have been saved. Publish your changes to make them public.",
              "success"
            )
          );
        })
        .catch(error => {
          console.log('error', error)
          return dispatch(
            showNotification(
              `There was an error saving your changes: ${error}`,
              "success"
            )
          );
        })
    });
  };
}

export function deploy() {
  return dispatch => {
    const url = `${process.env.GATSBY_DEPLOY_ENDPOINT}`;
    console.log(`Deploy command sent to ${url}`);

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(token => {
        return axios({
          method: "POST",
          url: url,
          headers: { Authorization: "Bearer " + token }
        });
      })
      .then(res => {
        console.log(res);
        if (res.data.status === "ok") {
          dispatch(
            showNotification(
              res.data.message,
              "success"
            )
          );
        } else {
          dispatch(
            showNotification(
              `There was an error deploying the site: ${res.data.message}`,
              "danger"
            )
          );
        }
      })
      .catch(err => {
        dispatch(
          showNotification(
            `There was an error deploying the site: ${err}`,
            "danger"
          )
        );
      });
  };
}

// export function deployWithStagingContent() {
//   return dispatch => {
//     copyContentFromStaging()
//       .then(() => {
//         dispatch(
//           showNotification(
//             "Your content has been copied from the staging site.",
//             "success"
//           )
//         );
//         dispatch(deploy())
//       })
//       .catch(err => {
//         dispatch(
//           showNotification(
//             `There was an error copying the content from the staging site: ${err}`,
//             "danger"
//           )
//         );
//       })
//   }
// }

export function loadPageData(data) {
  return { type: "LOAD_PAGE_DATA", data };
}

export function updatePageData(content) {
  return { type: "UPDATE_PAGE_DATA", content };
}

export function updatePageField(field, value) {
  return { type: "UPDATE_PAGE_FIELD", field, value };
}

export function setPages(pages) {
  return { type: "SET_PAGES", pages }
}

export function setOrderedPages(orderedPages) {
  return { type: "SET_ORDERED_PAGES", orderedPages }
}

export function fetchPages() {
  return (dispatch, getState) => {
    const db = firebase.firestore();

    db.collection('pages')
      .get()
      .then(snapshot => {
        console.log(snapshot)
        const pages = snapshot.reduce((obj, doc) => {
          const pageData = doc.data()
          obj[doc.id] = { ...pageData, id: doc.id }
          return obj
        }, {})

        console.log("Fetched pages", pages)
        dispatch(setPages(pages));
      })
      .catch(error => {
        console.log("Error fetching pages", error)
      })
  };
}



// NAVIGATION ------------------------

export function openMenu() {
  return { type: "OPEN_MENU" };
}

export function closeMenu() {
  return { type: "CLOSE_MENU" };
}

export function toggleMenu() {
  return { type: "TOGGLE_MENU" };
}

export function setCurrentLang(currentLang) {
  return { type: "SET_CURRENT_LANG", currentLang }
}


// CATEGORIES ------------------------

export function selectCategory(selected) {
  return { type: "SELECT_CATEGORY", selected };
}

export function unselectCategory(selected) {
  return { type: "UNSELECT_CATEGORY", selected };
}

export function addCategory(category) {
  return { type: "ADD_CATEGORY", category }
}

export function setCategories(categories) {
  return { type: "SET_CATEGORIES", categories }
}

// TRANSLATIONS ------------------------

export function updateTranslationState(translation) {
  return { type: "UPDATE_TRANSLATION_STATE", translation}
}


export function fetchTranslations() {
  return (dispatch, getState) => {
    const db = firebase.firestore();

    db
      .collection('translations')
      .get()
      .then(snap => {
        dispatch(setTranslations(snap))
      })
      .catch(error => {
        console.log("Error fetching translations", error)
      })
  };
}

export function updateTranslation(translation) {
  return (dispatch, getState) => {
    const db = firebase.firestore();

    db
      .collection('translations')
      .doc(translation.id)
      .update(translation)
      .then(res => {
        dispatch(updateTranslationState(translation));
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function setTranslations(strings) {
  return { type: "SET_TRANSLATIONS", strings }
}
