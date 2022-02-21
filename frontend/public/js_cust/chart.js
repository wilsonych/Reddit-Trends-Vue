const buildTable = () => {
    axios.get(`http://158.101.152.230:3000/post`)
        .then(response => {
            console.log("load data from API")
            localStorage.setItem('post', JSON.stringify(response.data));
            response.data.forEach(x => {
                var date = new Date(parseInt(x.created))
                const created = date.toLocaleString('en-GB').replace(/上午|下午/g, "")
                const content = `<tr>
                                    <td><button type="button" class="btn btn-primary btn-sm" onclick="buildOne('${x.id}')">View</button></td>
                                    <td>${x.forum}</td>
                                    <td><small>${created}</small></td>
                                    <td>${x.id}</td>
                                    <td><a href="https://www.reddit.com/r/${x.forum}/comments/${x.id}">${x.tittle}</a></td>
                                </tr>`
                document.getElementById("tbody").innerHTML += content
            })
            $('#dataTable').DataTable();

        })
        .catch(err => {
            console.log(err)
        })





}
const random255 = () => {
    return Math.floor(Math.random() * 255);
}
const randomCol = () => {
    return `rgb(${random255()},${random255()}, ${random255()})`
}
const buildOne = (symbol) => {
    const limit = document.getElementById("limit").value || 2000
    axios.get(`http://158.101.152.230:3000/post_trend/${symbol}/${limit}`)
        .then(function (response) {
            var ctx = document.getElementById('myChart').getContext('2d');
            var labels = []
            var comment = []
            var vote = []
            response.data.forEach(x => {
                comment.unshift(x.comment)
                vote.unshift(x.vote)
                labels.unshift(x.updated)
            })

            destoryChart()

            chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',
                data: {
                    datasets: [{
                        data: vote,
                        label: 'Vote',
                        backgroundColor: 'rgba(255,255, 255,0)',
                        borderColor: 'rgb(51,0, 255)',
                    }, {
                        data: comment,
                        label: 'Comment',
                        backgroundColor: 'rgba(255,255, 255,0)',
                        borderColor: 'rgb(255,0, 0)',
                    }],
                    labels: labels
                },

                // Configuration options go here
                options: {
                    scales: {
                        xAxes: [{
                            /** 
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function (value, index, values) {
                                    //console.log(index)
                                    let a = new Date(parseInt(value))
                                    return a.toLocaleString().replace(" ", "\n");
                                }
                            }*/
                        }]
                    }
                }
            });
        })
}
const getTrend = (callback) => {
    const minVote = document.getElementById("minVote").value || 100
    const minComment = document.getElementById("minComment").value || 100
    const limit = document.getElementById("limit").value || 2000
    const url = `http://158.101.152.230:3000/post_trend/${limit}/${minVote}/${minComment}`
    console.log(url)
    axios.get(url)
        .then((response) => {
            if (callback) {
                console.log("Got post trend")
                localStorage.setItem('trend', JSON.stringify(response.data));
                callback(response.data)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
const destoryChart = ()=>{
    if (chart != "") {
        chart.destroy()
    }
}

const toggleShow =()=>{
    const status = document.getElementById("filterBox").hidden
    document.getElementById("filterBox").hidden=!status
}
const build = (response,show) => {
    destoryChart()
    const minY = document.getElementById("minY").value || 0
    const maxY = document.getElementById("maxY").value || 2500

    var ctx = document.getElementById('myChart').getContext('2d');
    var labels = []
    var symbol = []
    var data = {}
    var show = show || "comment"

    var response = (response==null)? JSON.parse(localStorage.getItem('trend')):response
    console.log(minY,"-",maxY)


    response.forEach(x => {
        if (labels.indexOf(x.updated) == -1) {
            let a = new Date(x.updated)
            labels.unshift(x.updated)
        }
        if (data[x.id]) {

            if (x[show] > minY && x[show] < maxY ) {
                data[x.id].data.unshift({
                    x: x.updated,
                    y: x[show] 
                })
            }

        } else {
            symbol.push(x.id)
            data[x.id] = {
                label: x.id,
                backgroundColor: 'rgba(255,255, 255,0)',
                borderColor: randomCol(),
                data: []
            }
        }
    });
    //console.log(data)
    var show = []
    for (let i in data) {
        show.unshift(data[i])
    }
    if (chart != "") {
        chart.destroy()
    }
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        data: {
            labels: labels,
            datasets: show
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            //console.log(index)
                            let a = new Date(parseInt(value))
                            return a.toLocaleString().replace(" ", "\n");

                            /**
                            if (index % 4 == 0) {
                                return a.toLocaleString().replace(" ", "\n");
                            } else {
                                return null
                            }*/
                        }
                    }
                }]
            },
            legend: {
                display: false
            },
            onClick: (evt) => {
                var firstPoint = chart.getElementAtEvent(evt)[0];

                if (firstPoint) {
                    var label = chart.data.datasets[firstPoint._datasetIndex].label
                    
                    $("#dataTable").DataTable().search(label).draw();

                }
            }
        }
    });
}

const fouceRefresh = () => {
    buildTable()
    getTrend(build)
}

var chart = ""
window.onload = () => {
    getTrend(build)

    const post = localStorage.getItem('post');
    if (post) {
        console.log("load data from local")
        buildTable(JSON.parse(post))
    } else {
        buildTable()
    }
    var card = document.getElementsByClassName("card shadow mb-4")

    for (let i in card) {
        card[i].style.width = "100%";
    }
}