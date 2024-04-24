class SpecialHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `

        <link href="https://cdn.lineicons.com/4.0/lineicons.css" rel="stylesheet" />
        <link rel="stylesheet" href="./css/bootstrap/bootstrap.min.css">  
        <script src="./js/bootstrap/bootstrap.bundle.min.js"></script>

        <link rel="stylesheet" href="./styles.css">

   
        <div class="sidebar-content">
        <div class="wrapper">

            <!-- sidebar start -->
            <aside id="sidebar" class="position-fixed mr-5">
                <div class="d-flex">

                    <!-- toggle button -->
                    <button class="toggle-btn" type="button">
                        <i class="lni lni-grid-alt"></i>
                    </button>

                    <div class="sidebar-logo">
                        <a href="#">Profile</a>
                    </div>
                </div>

                <!-- <inside toggle -->
                <!-- Profile -->
                <ul class="sidebar-nav">
                    <li class="sidebar-item">
                        <a href="profie.html" class="sidebar-link">
                            <i class="lni lni-user"></i>
                            <span>Profile</span>
                        </a>
                    </li>

                    <!-- Activities -->
                    <li class="sidebar-item">
                        <a href="activities.html" class="sidebar-link">
                            <i class="" style="font-size: 1.15rem; font-weight: 600px;"><svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-activity" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2" />
                                </svg></i>
                            <span>Activities</span>
                        </a>
                    </li>

                    <!-- Reference -->
                    <li class="sidebar-item">
                        <a href="reference.html" class="sidebar-link">
                            <i class="" style="font-size: 1.15rem; font-weight: 600px;"><svg
                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-clipboard-data" viewBox="0 0 16 16">
                                    <path
                                        d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
                                    <path
                                        d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                                    <path
                                        d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                                </svg></i>
                            <span>Reference</span>
                        </a>
                    </li>

                    <!-- Check Status -->
                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link">
                            <i class="bi bi-clipboard2-check" style="font-size: 1.15rem;
                            font-weight: 600px;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="currentColor" class="bi bi-clipboard2-check" viewBox="0 0 16 16">
                                    <path
                                        d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z" />
                                    <path
                                        d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                                    <path
                                        d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
                                </svg></i>
                            <span>Check Status</span>
                        </a>
                    </li>

                    <!-- SEMESTER -->
                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#sem" aria-expanded="false" aria-controls="sem">
                            <i class="bi bi-mortarboard" style="font-size: 1.15rem;
                            font-weight: 600px;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="currentColor" class="bi bi-mortarboard" viewBox="0 0 16 16">
                                    <path
                                        d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z" />
                                    <path
                                        d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z" />
                                </svg></i>
                            <span>SEMESTER</span>
                        </a>
                        <ul id="sem" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li class="sidebar-item">
                                <a href="#" class="sidebar-link disabled ">SEMESTER 3</a>
                            </li>
                            <li class="sidebar-item">
                                <a href="activities.html" class="sidebar-link">SEMESTER 4</a>
                            </li>
                            <li class="sidebar-item">
                                <a href="#" class="sidebar-link disabled ">SEMESTER 5</a>
                            </li>
                            <li class="sidebar-item">
                                <a href="#" class="sidebar-link disabled ">SEMESTER 6</a>
                            </li>
                        </ul>
                    </li>

                    <!-- Logout -->
                    <!-- <li class="sidebar-item">
                        <a href="login.html" class="sidebar-link">
                            <i class="lni lni-exit"></i>
                            <span>Logout</span>
                        </a>
                    </li> -->
                </ul>

                <div class="sidebar-footer">
                </div>
            </aside>
        </div>
        <!-- side bar end -->

        <!--content area-->

        <!--header-->
        <div class="container-fluid" style="background-color: rgb(254, 254, 254);">
            <div class="row">
                <div class="col-10 text-center ">
                    <h1 class="display-6">SAP CALCULATOR</h1>
                </div>


                <div class="col-2 mt-2">
                    <div class="dropdown d-flex justify-content-end">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <img src="image/entrepreneurship.png" alt="Profile Image" class="rounded-circle"
                                    style="width: 30px; height: 30px; margin-right: 5px;">
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="profie.html">Profile</a></li>
                                <li><a class="dropdown-item" href="#">Log Out</a></li>
                                <!-- <li><a class="dropdown-item" href="#">Something else here</a></li> -->
                            </ul>
                        </li>
                    </div>
                </div>
            </div>
        </div>

        <script src="./js/bootstrap/bootstrap.bundle.min.js"></script>
    </div>
    `;

        // Add event listener for hamburger button
        const hamBurger = this.querySelector(".toggle-btn");
        hamBurger.addEventListener("click", function () {
            document.querySelector("#sidebar").classList.toggle("expand");
        });

    }
}
customElements.define('special-header', SpecialHeader);
