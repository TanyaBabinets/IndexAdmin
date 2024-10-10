
$(document).ready(function () {

    function GetGenres() {

        $.ajax({

            url: "https://localhost:7264/api/Genres",
            method: "GET",

            contentType: "application/json",
            success: function (genres) {
                console.log("Genres received:", genres);
                $(".genre1 tbody").empty(); // Очищаем предыдущие данные
                let rows = "";

                $.each(genres, function (index, genre) {
                    rows += row1(genre); // Генерируем строки для каждой записи жанра
                });

                $(".genre1 tbody").append(rows); // Добавляем новые строки в таблицу
                //нажимаем на ссылку Изменить
                $("body").on("click", ".editLink1", function () {
                    console.log("Edit button clicked!");
                    let id = $(this).data("id");
                    console.log("Editing genre with ID:", id);
                    GetGenre(id);
                });
            },
            error: function (x) {
                console.log(x);
            }

        });
    }
    let row1 = function (genre) {
        let temp1 = `
            <tr>
                <td>${genre.name}
                    <button class='editLink1' id='blue' data-id='${genre.id}'>Изменить</button>
                    <button class='removeLink1' id='blue' data-id='${genre.id}'>Удалить</button>
                </td>
            </tr>`;

        return temp1; // Возвращаем строку с жанром
    };



    GetUsers();
    GetGenres();
    //Получение всех
    function GetUsers() {
        $.ajax({

            url: "https://localhost:7264/api/Users",
            method: "GET",
            contentType: "application/json",
            success: function (users) {

                let rows = "";
                $.each(users, function (index, user) {

                    rows += row2(user);
                })
                $(".user1").append(rows);
            },
            error: function (x) {
                console.log(x);
            }
        });
    }
    function CleanUser() {

        let form = document.getElementById("userName");
        form.elements["Id"].value = 0;
        form.elements["firstName"].value = "";
        form.elements["lastName"].value = "";
        form.elements["login"].value = "";
        form.elements["email"].value = "";
    }



    //Получение одного
    function GetUser(id) {
        $.ajax({
            url: "https://localhost:7264/api/Users/" + id,
            method: 'GET',
            contentType: "application/json",
            success: function (user) {
                let form = document.forms["userForm"];
                form.elements["Id"].value = user.id;
                form.elements["firstName"].value = user.firstName;
                form.elements["lastName"].value = user.lastName;
                form.elements["login"].value = user.login;
                form.elements["email"].value = user.email;

            },
            error: function (x) {
                alert(x.status);
            }
        });
    }
    //Изменение
    function EditUser(userId, userName, userLastname, userLogin, userEmail) {

        let request = JSON.stringify({
            id: userId,
            firstname: userName,
            lastname: userLastname,
            login: userLogin,
            email: userEmail

        });
        $.ajax({
            url: "https://localhost:7264/api/Users",
            contentType: "application/json",
            method: "PUT",
            data: request,
            success: function (user) {
                alert("Данные пользователя изменены");
                location.reload();
            },
            error: function (x) {
                alert(x.status);
            }
        });
    }


    //Удаление
    function DeleteUser(id) {
        if (!confirm("Вы действительно желаете удалить пользователя?"))
            return;
        $.ajax({
            url: "https://localhost:7264/api/Users/" + id,
            contentType: "application/json",
            method: "DELETE",
            success: function (user) {
                location.reload();
            },
            error: function (x, y, z) {
                alert(x.status + '\n' + y + '\n' + z);
            }
        });
    }

    //создание строки для таблицы
    let row2 = function (user) {

        let temp2 = "<div class='user'>Имя: " + user.firstName +
            "<br>Фамилия: " + user.lastName +
            "<br>Логин: " + user.login + "<br>Email: " + user.email;


        temp2 += "<br><button id='blue' class='editLink2' data-id='" + user.id + "'>Изменить</a>  " +
            "<button id='blue' class='removeLink2' data-id='" + user.id + "'>Удалить</a></div>";

        return temp2;
    };
    //сброс значений формы
    $("#reset2").click(function (e) {
        e.preventDefault();
        let form = document.forms["userForm"];
        form.reset();
        form.elements["Id"].value = 0;
    });

    //отправка формы
    $("#submitUser").click(function (e) {
        e.preventDefault();
        let form = document.forms["userForm"];
        let id = form.elements["Id"].value;
        let firstname = form.elements["firstName"].value;
        let lastname = form.elements["lastName"].value;
        let login = form.elements["login"].value;
        let email = form.elements["email"].value;

        if (id == 0)
            CreateUser(firstname, lastname, login, email);
        else
            EditUser(id, firstname, lastname, login, email);
    });

    //нажимаем на ссылку Изменить
    $("body").on("click", ".editLink2", function () {
        console.log("BUTTN user");
        let id = $(this).data("id");
        GetUser(id);

    });

    //нажимаем на ссылку Удалить
    $("body").on("click", ".removeLink2", function () {
        let id = $(this).data("id");
        DeleteUser(id);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////
    // загрузка
    GetSongs();

    // Получение всех
    function GetSongs() {
        console.log("Запрос к API для получения песен...");

        $.ajax({
            contentType: "application/json",
            url: "https://localhost:7264/api/Songs",
            method: 'GET',
            success: function (songs) {
                console.log("Songs:", songs);
                let rows = "";
                if (Array.isArray(songs) && songs.length > 0) {
                    $.each(songs, function (index, song) {
                        const imageUrl = song.pic;

                        // Логируем URL для проверки
                        rows += row(song);
                    });
                    $(".song1").append(rows);
                } else {
                    console.log("No songs found or data is not an array.");
                }
            },


            error: function (x) {
                console.log(x.responseText);
            }
        });
    }



    let row = function (song) {

        let temp =
            `<div class='song'>
										<audio src='https://localhost:7264${song.file}' controls></audio>
								<div class="data-all">

										  <div class='data'>

										 <p>Название: ${song.name}</p>
											<p>Исполнитель: ${song.singer}</p>
											<p>Длительность: ${song.runtime}</p>
											<p>Размер в МБ: ${song.size}</p>
											<p>Дата загрузки: ${song.dateView}</p>
											<p>Жанр: ${song.genre.name}</p>
											${song.user && song.user.name ? `<p>Пользователь: ${song.user.name}</p>` : ''}
											</div>
                                            <div class='data2'>
                                             <img class='pict' src='https://localhost:7264${song.pic}' alt='Постер'></img>
                                            <div class='btn2'>
											<button id='blue' class='editLink' data-id='${song.id}'>Изменить</button>
											<button id='blue' class='removeLink' data-id='${song.id}'>Удалить</button>
										</div></div>
									
                                        
									</div>
									<hr>
								</div>`;
        return temp;

    };
    // Получение одного
    function GetSong(id) {

        $.ajax({
            url: 'https://localhost:7264/api/Songs/' + id,
            method: 'GET',
            contentType: "application/json",
            success: function (song) {
                console.log(song);
                GetGenres();
                let form = document.forms["songForm"];
                form.elements["Id"].value = song.id;
                form.elements["name"].value = song.name;
                form.elements["singer"].value = song.singer;
                form.elements["runtime"].value = song.runtime;
                form.elements["size"].value = song.size;
                form.elements["datetime"].value = song.datetime;
                form.elements["genre"].value = song.genre.id;
                form.elements["user"].value = song.user;
                if (song.file) {
                    let audioF = document.getElementById("FileCreate");
                    audioF.src = "https://localhost:7264" + song.file;
                    // audioF.src = song.file;
                    audioF.style.display = "block";
                }

                if (song.pic) {
                    let imgPreview = document.getElementById("PosterCreate");
                    // imgPreview.src = song.pic;
                    imgPreview.src = "https://localhost:7264" + song.pic;
                    imgPreview.style.display = "block";
                }
                $("input[name='user']").val(song.user ? song.user.name : "");
            },
            error: function (x) {
                alert(x.status);
            }
        });
    }

    $('#submit').click(function (e) {

        e.preventDefault();
        let formData = new FormData();

        formData.append("name", $('#nameSong').val());
        formData.append("singer", $('#singerSong').val());
        formData.append("runtime", $('#runtimeSong').val());
        formData.append("size", $('#sizeSong').val());
        formData.append("datetime", $('#datetime').val());
        formData.append("genre", $('#genreSelect').val());
        formData.append("user", $('#userSong').val());

        var musfile = $('#musFile')[0].files[0];
        var picfile = $('#AddPoster')[0].files[0];

        if (musfile) {
            formData.append("musfile", musfile);
        }
        if (picfile) {
            formData.append("picfile", picfile);
        }

        let idSong = $('#idSong').val();
        console.log("formData");
        console.log(formData);
        if (idSong === '0') {
            $.ajax({
                type: "POST",
                url: 'https://localhost:7264/api/Songs',
                contentType: false,
                processData: false,
                data: formData,
                success: function (result) {
                    location.reload();
                    alert("Песня добавлена");
                },
                error: function (xhr, status, p3) {
                    console.log(xhr.responseText);
                }
            });
        }
        else {
            formData.append("Id", idSong);

            console.log("work")
            $.ajax({
                type: "PUT",
                url: 'https://localhost:7264/api/Songs',
                contentType: false,
                processData: false,
                data: formData,
                success: function (result) {
                    location.reload();
                    alert("Песня изменена");
                },
                error: function (xhr, status, p3) {
                    console.log(xhr.responseText);
                }
            });
        }


    });

    // Добавление
    function CreateSong(songName, songSinger, songRun, songSize, songPic, songFile, songDate, songGenre, songUser) {
        let formData = new FormData();
        formData.append("name", songName);
        formData.append("singer", songSinger);
        formData.append("runtime", songRun);
        formData.append("size", songSize);
        formData.append("pic", songPic);
        formData.append("file", songFile);
        formData.append("datetime", songDate);
        formData.append("GenreId", songGenre);
        formData.append("user", songUser);

        $.ajax({
            url: "https://localhost:7264/api/Songs",
            // contentType: "application/json",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,


            success: function (song) {

                console.log(song);
                $(".song1").append(row(song));
                let form = document.forms["songForm"];

                form.elements["Id"].value = 0;
                location.reload();
                alert("Песня добавлена");
            },
            error: function (x) {
                alert(x.status);
            }
        });
    }

    function EditSong(id, name, singer, runtime, size, Datetime, genre, user) {

        let formdata = new FormData();
        formdata.append("id", id);
        formdata.append("name", name);
        formdata.append("singer", singer);
        formdata.append("runtime", runtime);
        formdata.append("size", size);
        formdata.append("datetime", Datetime);
        let formattedDate = new Date(Datetime).toISOString().split('T')[0]; // Приводим к формату yyyy-MM-dd
        formdata.append("datetime", formattedDate);
        formdata.append("genre", genre);
        formdata.append("user", user);
        const musfile = $('#musFile')[0].files[0];
        const picfile = $('#AddPoster')[0].files[0];

        if (musfile) {
            formdata.append("file", musfile);
        }
        if (picfile) {
            formdata.append("pic", picfile);
        }

        $.ajax({
            url: 'https://localhost:7264/api/Songs/' + id,
            method: 'PUT',
            data: formdata,
            processData: false,
            contentType: false,
            success: function (song) {
                alert("Песня изменена");
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Произошла ошибка при изменении песни:", error);
            }
        });
    }


    // Удаление
    function DeleteSong(id) {
        if (!confirm("Вы действительно желаете удалить песню?"))
            return;
        $.ajax({
            url: "https://localhost:7264/api/Songs/" + id,
            contentType: "application/json",
            method: "DELETE",
            success: function (song) {
                alert("Песня удалена");
                location.reload();
            },
            error: function (x, y, z) {
                alert(x.status + '\n' + y + '\n' + z);
            }
        });
    }
    // сброс значений формы
    $("#reset").click(function (e) {
        e.preventDefault();
        CleanSong();
    });

    // очистка формы
    function CleanSong() {
        $("form[name='songForm']")[0].reset(); // Сброс всех полей формы
        $("#FileCreate").attr("src", ""); // Очистка изображения для файла
        $("#PosterCreate").attr("src", ""); // Очистка изображения постера
    }

    // нажимаем на ссылку Изменить
    $("body").on("click", ".editLink", function () {
        let id = $(this).data("id");
        GetSong(id);
    });

    // нажимаем на ссылку Удалить
    $("body").on("click", ".removeLink", function () {
        let id = $(this).data("id");
        DeleteSong(id);
    });
    //////////////////////////////////////////////////////////////////////////////////////////////




    //Получение одного
    function GetGenre(id) {
        $.ajax({
            url: "https://localhost:7264/api/Genres/" + id,
            method: 'GET',
            contentType: "application/json",
            success: function (genre) {
                let form = document.forms["genreForm"];
                console.log(genre);

                console.log(form);
                form.elements["Id"].value = genre.id;
                form.elements["name"].value = genre.name;

            },
            error: function (x) {
                alert(x.status);
            }
        });
    }



    //Добавление
    function CreateGenre(genreName) {
        $.ajax({
            url: "https://localhost:7264/api/Genres",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                name: genreName,

            }),
            success: function (genre) {
                alert("Жанр добавлен");
                $(".genre1").append(row1(genre));
                // let form = document.forms["genreForm"];
                // form.reset();
                // CleanGenre();

                location.reload();

            },
            error: function (x) {
                alert(x.status);
            }
        })
    }

    function CleanGenre() {

        let form = document.getElementById("genreName");
        form.elements["name"].value = "";
        form.elements["Id"].value = 0;

    }


    //Изменение
    function EditGenre(genreId, genreName) {

        let request = JSON.stringify({
            id: genreId,
            name: genreName,

        });

        $.ajax({
            url: "https://localhost:7264/api/Genres",
            contentType: "application/json",
            method: "PUT",
            data: request,

            success: function (genre) {
                alert("Жанр изменен");
                location.reload();
            },
            error: function (x) {
                alert(x + '\n' + y + '\n' + z);
            }
        })
    }


    //Удаление
    function DeleteGenre(id) {
        if (!confirm("Вы действительно желаете удалить жанр?"))
            return;
        $.ajax({
            url: "https://localhost:7264/api/Genres/" + id,
            contentType: "application/json",
            method: "DELETE",
            success: function (genre) {
                alert("Жанр удален");
                location.reload();
            },
            error: function (x, y, z) {
                alert(x.status + '\n' + y + '\n' + z);
            }
        })
    }




    //сброс значений формы
    $("#reset1").click(function (e) {
        e.preventDefault();
        let form = document.forms["genreForm"];
        form.reset();
        form.elements["Id"].value = 0;
    });

    //отправка формы
    $("#submitgenre").click(function (e) {
        e.preventDefault();
        let form = document.forms["genreForm"];
        let id = form.elements["Id"].value;
        let name = form.elements["name"].value;
        if (id == 0) {
            CreateGenre(name);
        }
        else {
            EditGenre(id, name);

        }
    });
    setTimeout(function () {
        console.log("Checking if edit buttons exist:", $(".editLink1")); // Проверяем наличие кнопок
    }, 1000);


    // //нажимаем на ссылку Изменить
    // $("body").on("click", ".editLink2", function () {
    //     let id = $(this).data("id");
    //     GetUser(id);

    // });
    //нажимаем на ссылку Удалить
    $("body").on("click", ".removeLink1", function () {
        let id = $(this).data("id");
        DeleteGenre(id);
    });

});





// // Обработчик загрузки файла MP3
// $('#musFile').on('change', function () {
//     const fileName = $(this).val().split('\\').pop();
//     $('#FileCreate').attr('src', URL.createObjectURL(this.files[0]));
//     console.log('Загружен аудиофайл:', fileName);
// });

// // Обработчик загрузки постера
// $('#AddPoster').on('change', function () {
//     const fileName = $(this).val().split('\\').pop();
//     $('#PosterCreate').attr('src', URL.createObjectURL(this.files[0]));
//     console.log('Загружен постер:', fileName);
// });
