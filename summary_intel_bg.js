"use strict";
{
  const summaryIntel = {
    countPublicPhotosTagged,
    countPublicPhotosLiked,
    countPublicStoriesTagged,
    countPublicStoriesLiked
  };

  const newTab = promisify((...args) => chrome.windows.create(...args));
  const exe = promisify((...args) => chrome.tabs.executeScript(...args));

  Object.assign(self, summaryIntel);

  /**
    const storyStamps = Array.from(document.querySelectorAll('.timestampContent'));
    const photoLinks = Array.from(document.querySelectorAll('a[rel="theater"]'));
  **/

  async function countPublicPhotosTagged(id) {
    const win = await newTab({
      focused: false,
      url: `https://www.facebook.com/search/${id}/photos-tagged/intersect`
    });
    const tab = win.tabs[0];
    exe(tab.id, {
      code: `
        (function() {
          let count = 0;
          let retries = 5;
          const int = setInterval(() => {
            scrollTo(0,scrollY+9999);
            const photoLinks = Array.from(document.querySelectorAll('a[rel="theater"]')).length;
            const newCount = photoLinks / 2;
            if ( newCount == count ) {
              retries--;
              if ( retries <= 0 ) {
                clearInterval(int);
                chrome.runtime.sendMessage({id:${id},count,type:'countUpdate',countType:'publicPhotosTagged',done:true});
              }
            } else {
              count = newCount;
              chrome.runtime.sendMessage({id:${id},count,type:'countUpdate',countType:'publicPhotosTagged',done:false});
            }
          }, 2000);
        }());
      `
    });
  }

  async function countPublicPhotosLiked(id) {
    const win = await newTab({
      focused: false,
      url: `https://www.facebook.com/search/${id}/photos-liked/intersect`
    });
    const tab = win.tabs[0];
    exe(tab.id, {
      code: `
        (function() {
          let count = 0;
          let retries = 5;
          const int = setInterval(() => {
            scrollTo(0,scrollY+9999);
            const photoLinks = Array.from(document.querySelectorAll('a[rel="theater"]')).length;
            const newCount = photoLinks / 2;;
            if ( newCount == count ) {
              retries--;
              if ( retries == 0 ) {
                clearInterval(int);
                chrome.runtime.sendMessage({id:${id},count,countType:'publicPhotosLiked',type:'countUpdate',done:true});
              }
            } else {
              count = newCount;
              chrome.runtime.sendMessage({id:${id},count,countType:'publicPhotosLiked',type:'countUpdate',done:false});
            }
          }, 2000);
        }());
      `
    });
  }

  async function countPublicStoriesTagged(id) {
    const win = await newTab({
      focused: false,
      url: `https://www.facebook.com/search/${id}/stories-tagged/intersect`
    });
    const tab = win.tabs[0];
    exe(tab.id, {
      code: `
        (function() {
          let count = 0;
          let retries = 5;
          const int = setInterval(() => {
            scrollTo(0,scrollY+9999);
            const newCount = Array.from(document.querySelectorAll('.timestampContent')).length;
            if ( newCount == count ) {
              retries--;
              if ( retries == 0 ) {
                clearInterval(int);
                chrome.runtime.sendMessage({id:${id},count,countType:'publicStoriesTagged',type:'countUpdate',done:true});
              }
            } else {
              count = newCount;
              chrome.runtime.sendMessage({id:${id},count,countType:'publicStoriesTagged',type:'countUpdate',done:false});
            }
          }, 2000);
        }());
      `
    });
  }

  async function countPublicStoriesLiked(id) {
    const win = await newTab({
      focused: false,
      url: `https://www.facebook.com/search/${id}/stories-liked/intersect`
    });
    const tab = win.tabs[0];
    exe(tab.id, {
      code: `
        (function() {
          let count = 0;
          let retries = 5;
          const int = setInterval(() => {
            scrollTo(0,scrollY+9999);
            const newCount = Array.from(document.querySelectorAll('.timestampContent')).length;
            if ( newCount == count ) {
              retries--;
              if ( retries == 0 ) {
                clearInterval(int);
                chrome.runtime.sendMessage({id:${id},count,countType:'publicStoriesLiked',type:'countUpdate',done:true});
              }
            } else {
              count = newCount;
              chrome.runtime.sendMessage({id:${id},count,countType:'publicStoriesLiked',type:'countUpdate',done:false});
            }
          }, 2000);
        }());
      `
    });
  }
}
