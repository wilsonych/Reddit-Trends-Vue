<template>
	<div class="container">
		<v-data-table :headers="headers" :items="items" hide-default-header hide-default-footer class="elevation-1">
			<template v-slot:item.title="props">
				<a :href="`https://www.reddit.com/r/${props.item.forum}/comments/${props.item.id}`">{{ props.item.title }}</a>
			</template>
			<template v-slot:item.change="props"> 🡱 {{ props.item.change }} % </template>
		</v-data-table>
	</div>
</template>
<script>
export default {
    props: ["items"],
	data() {
		return {
			headers: [
				{ text: "title", value: "title" },
				{ text: "forum", value: "forum" },
				{ text: "vote", value: "VOTE" },
				{ text: "change", value: "change" },
			],
		};
	},
};
</script>
<style>
.center {
	margin: auto;
	padding: 10px;
}
</style>
