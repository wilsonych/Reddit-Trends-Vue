<template>
	<div class="container">
		<v-data-table :headers="headersVote" :items="items"  hide-default-footer class="elevation-1" :calculate-widths="true">
			<template v-slot:item.title="props">
				<a :href="`https://www.reddit.com/r/${props.item.forum}/comments/${props.item.id}`">{{ props.item.title }}</a>
			</template>
			<template v-slot:item.change="props"> &#8593; {{ props.item.change }} % </template>
		</v-data-table>
	</div>
</template>
<script>
export default {
    props: ["items"],
	data() {//hide-default-header
		return {
			headersVote: [
				{ text: "Title", value: "title" },
				{ text: "Forum", value: "forum" },
				{ text: "Quantity", value: "MAX" },
				{ text: "Change", value: "change", width:"20%" },
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
