<template>
	<div class="w-100">
		<!-- Header-->
		<header class="bg-dark py-5" :style="headerProps">
			<div class="container px-5">
				<div class="row gx-5 align-items-center justify-content-center">
					<div class="col-lg-4">
						<div class="my-5 text-xl-start text-center">
							<h1 class="display-5 fw-bolder text-white mb-2">Reddit-Trends</h1>
							<p class="lead fw-normal text-white mb-4">Reddit-Trends is a simple application to visualizer the thread's trends on stock related subreddit.</p>
							<div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
								<router-link to="/dashboard">
									<a class="btn btn-primary btn-lg px-4 me-sm-3">View more</a>
								</router-link>
							</div>
						</div>
					</div>
                    <!--
					<div class="col-xl-8 mb-4 d-flex flex-column justify-content-between">
						<TrendChart ref="trendChart" :post="postTrend" :chart-setting="chartSetting" :searchPost="() => {}" :toggle="() => {}" :demo="true" />
					</div>
                    -->
				</div>
			</div>
		</header>

		<section class="py-5" id="features">
			<div class="text-center">
				<h2>
					24 hour change of 
					<v-btn elevation="2" @click="showVote=!showVote">{{ showVote ? "vote" : "comment" }}</v-btn>
				</h2>
			</div>
            <Vote v-if="showVote" :items="publicVote" />
            <Comment v-else :items="publicComment" />			
		</section>

        <div class="py-5 bg-light">
            <div class="text-center">
				<h2>
					Data distribution
				</h2>
			</div>
			<div class="container px-5 my-5">
				<div class="row gx-5 justify-content-center">
					<Chart />
				</div>
			</div>
		</div>

		<section class="py-5" id="features">
			<div class="container px-5">
				<div class="row gx-5 row-cols-1 row-cols-md-2 ">
					<Status tittle="Post total" target="/count/post" icon="fa-calculator" />
					<Status tittle="Trend total" target="/count/post_trend" icon="fa-globe-americas" />
					<Status tittle="Last update" target="/count/last" date icon="fa-clock" />
					<Status tittle="Memory" target="/status/ram" date icon="fa-memory" :custHandler="handleMenoryCard" />
				</div>
			</div>
		</section>

	</div>
</template>
<script>
// @ is an alias to /src
import Chart from "@/components/Index/Chart";
import Docker from "@/components/Home/Docker";
import TrendChart from "@/components/TrendChart";
import Status from "@/components/Index/Status";
import apiHandler from "@/lib/apiHandler";
import Vote from "@/components/Index/Vote";
import Comment from "@/components/Index/Vote";

export default {
	name: "Home",
	components: { Chart, Docker, Status, TrendChart, Chart, Vote, Comment },
	data() {
		return {
			postTrend: [],
			DetailChart: [],
			chartSetting: {
				minY: 0,
				maxY: 2000,
				show: "vote",
			},
			displayAllPost: true,
			post: [],
			errorMsg: [],
			isLoading: true,
			showVote: true,
			publicVote: [],
			publicComment: [],
			headerProps: {
				backgroundImage: `url(${require('@/../img/bg2.jpeg')})`,
				backgroundSize: "cover"
			}
		};
	},
	methods: {
		handleMenoryCard(result) {
			return `${result.total - result.free} / ${result.total} MB`;
		},
		fetchAllPostTrend() {
			const option = {url: "/public/trend"};
			apiHandler(option, (response) => {
				this.postTrend = response;
				this.displayAllPost = true;
				this.isLoading = false;
				this.renderChart();
			});
		},
		fetchPublicVote() {
			const option = { url: "/public/vote" };
			apiHandler(option, (response) => (this.publicVote = response));
		},
		fetchPublicComment() {
			const option = { url: "/public/comment" };
			apiHandler(option, (response) => (this.publicComment = response));
		},
		renderChart() {
			const child = this.displayAllPost ? this.$refs.trendChart : this.$refs.detailChart;
			child.initData();
		},
	},
	mounted() {
		//this.fetchAllPostTrend();
		this.fetchPublicVote();
        this.fetchPublicComment();
	},
};
</script>
<style>
.center {
	margin: auto;
	padding: 10px;
}
</style>
