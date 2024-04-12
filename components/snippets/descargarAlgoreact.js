  let link = document.createElement('a');
            const url = window.URL.createObjectURL(
                new Blob([docFirmado]),
              );
            link.href = url;
            link.setAttribute(
              'download',
              `FileName.xml`,
            );
               
            link.click();