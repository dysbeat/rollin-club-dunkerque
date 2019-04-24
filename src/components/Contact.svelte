<form class="container" method="GET" action="mailto:rollinclub.dunkerque@gmail.com" enctype="text/plain">
	<p class="blue title">Sujet</p>
	<input class="zone" type="text" name="subject" />

	<p class="blue title">Message</p>
	<textarea class="zone message" name="body"></textarea>

	<div><input class="submit" type="submit" value="Send" /></div>

</form>

<style>
  .container {
    margin: auto;
  }
  .zone {
    width: 100%;
    margin-bottom: 20px;
    background-color: hsl(203, 15%, 90%);
  }
  .message {
    margin-bottom: 20px;
    height: 200px;
  }
  .submit {
    cursor: pointer;
    padding: 5px;
    margin-right: 5px;
    float: right;
    background-color: hsl(203, 15%, 70%);
  }
  .submit:hover {
    color: hsl(220, 37%, 35%);
  }
</style>
