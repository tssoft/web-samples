test('test createMessage()', function() {
	// Метод createMessage() создает объект сообщения чата,
	// протестируем, что сообщение формируется в правильном формате
	var userName = 'user 1';
	var text = 'Hello!';
	// Результат вызова метода
	var actualMessage = chat.createMessage(userName, text);
	// Эталонное сообщение
	var expectedMessage = {userName: userName, text: text};
	// Сравниваем эталонный объект и результат 
	deepEqual(actualMessage, expectedMessage, 'Неверный формат сообщения')
});
test('test quoteTool.insertQuote()', function() {
	// Метод quoteTool.insertQuote() вставляет в textarea выделенный
	// текст, форматируя его как цитату
	
	// В #qunit-fixture добавим верстку с сообщениями чата
	var fixture = $('#qunit-fixture');
	fixture.append('<div id="id1">123456</div>');
	// В этой переменной текст, который будет выделен как цитата
	var expectedText = 'qwerty';
	fixture.append('<div id="id2">' + expectedText + '</div>');
	fixture.append('<div id="id3">йцукен</div>');
	fixture.append('<textarea id="message_text"</textarea>');
	// Выделяем требуемый текст на странице
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(document.getElementById('id2'));
	selection.removeAllRanges();
	selection.addRange(range);
	// Создаем тестируемый объект
	var textArea = $('textarea#message_text');
	var quoteTool = chat.quoteTool(textArea);
	quoteTool.insertQuote();
	// Проверяем, что после вызова метода в textarea вставлен 
	// отформатированный выбранный текст
	deepEqual(textArea.val(), '>> ' + expectedText + '\n', 'Неверный текст цитаты');
});
test('test messageTool.addMessage()', function() {
	// Метод messageTool.addMessage() создает из текста в textarea сообщение,
	// добавляет его в историю чата и отправляет на сервер. После добавления
	// сообщения textarea очищается.
	
	// Создаем textarea с текстом сообщения
	var userName = 'user name';
	var text = 'Expected message text';
	var fixture = $('#qunit-fixture');
	fixture.append('<textarea id="message_text">' + text + '</textarea>');
	
	var chatControl = chat.chatControl({});
	// mock для объекта chatControl
	var chatControlMock = this.mock(chatControl);
	var expectedMessage = chat.createMessage(userName, text);
	// Настраиваем требование - метод chatControl.addMessage() должен быть
	// вызван ровно один раз с нужным параметром
	chatControlMock.expects('addMessage').once().withExactArgs(expectedMessage);
	var server = chat.server({});
	// mock для объекта server
	var serverMock = this.mock(server);
	// Требуем, что server.saveMessage() будет вызван один раз с нужным параметром
	serverMock.expects('saveMessage').once().withExactArgs(expectedMessage);
	
	var textArea = $('textarea#message_text');
	var messageTool = chat.messageTool({
		textArea: textArea,
		chatControl: chatControl,
		server: server,
		userName: userName
	});
	messageTool.addMessage();
	// После вызова тестируемого метода проверяем, что работа с объектами
	// прошла по ожидаемому сценарию
	chatControlMock.verify();
	serverMock.verify();
	// Проверяем очистку textArea
	deepEqual(textArea.val(), '', 'textarea не очищена');
});

module('chatControl tests', {
	setup: function() {
		// Инициализируем верстку перед тестами
		var fixture = $('#qunit-fixture');
		fixture.append('<div id="chat_window"></div>');
		// Переменные chatDiv, server и chatControl будут видны
		// во всех тестах модуля
		this.chatDiv = $('#chat_window');
		this.server = chat.server({saveUrl: 'http://test.com/save', loadUrl: 'http://test.com/load'});
		var config = {
			chatDiv: this.chatDiv,
			server: this.server
		};
		this.chatControl = chat.chatControl(config);
	}
});
test('test addMessage() with empty args', function() {
	// Проверяем, что в чат нельзя добавить пустое сообщение.
	// Переменные chatDiv и chatControl инициализированы в 
	// методе setup() модуля.
	deepEqual(this.chatDiv.html(), '', 'Содержимое не пусто №1');
	this.chatControl.addMessage({userName: 'userName', text: ''});
	deepEqual(this.chatDiv.html(), '', 'Содержимое не пусто №2');
	this.chatControl.addMessage({userName: '', text: 'test'});
	deepEqual(this.chatDiv.html(), '', 'Содержимое не пусто №3');
});
test('test addMessage()', function() {
	deepEqual(this.chatDiv.html(), '', 'Содержимое не пусто');
	
	this.stub(this.server, 'saveMessage');

	var message = chat.createMessage('Иванов И. И.', 'Привет!');
	this.chatControl.addMessage(message);
	
	notDeepEqual(this.chatDiv.html(), '', 'Содержимое пусто');
	var messageTitle = this.chatDiv.find('div.message-title');
	deepEqual(messageTitle.length, 1, 'Неверный заголовок сообщения')
	var spans = messageTitle.find('span');
	deepEqual(spans.length, 2, 'Неверное число span в заголовке');
	deepEqual(spans.eq(0).html(), message.userName, 'Неверное имя пользователя');
	notDeepEqual(spans.eq(1).html(), '', 'Время сообщения пусто');
	
	var messageText = this.chatDiv.find('div.text');
	deepEqual(messageText.length, 1, 'Неверное количество div сообщения');
	deepEqual(messageText.html(), message.text, 'Неверный текст сообщения');
	
	var quoteText = this.chatDiv.find('div.quote');
	deepEqual(quoteText.length, 0, 'Неверное количество div цитаты');
});
test('test addMessage() with quote', function() {
	deepEqual(this.chatDiv.html(), '', 'Содержимое не пусто');

	var quote = '>> Привет!\n';
	var text = 'Hello!';
	var message = chat.createMessage('Петров П. П.', quote + text);
	
	deepEqual(this.chatDiv.html(), '', 'Содержимое не пусто');
	this.chatControl.addMessage(message);
	
	var quoteText = this.chatDiv.find('div.quote');
	deepEqual(quoteText.length, 1, 'Неверное количество div цитаты');
	deepEqual(quoteText.html(), '&gt;&gt; Привет!', 'Неверный текст цитаты');
	
	var messageText = this.chatDiv.find('div.text');
	deepEqual(messageText.length, 1, 'Неверное количество div сообщения');
	deepEqual(messageText.html(), text, 'Неверный текст сообщения');
});
test('test updateMessages()', function() {
	// Метод chatControl.updateMessages() запрашивает новые сообщения
	// у сервера и добавляет их в историю чата.
	
	// message1, message2 - новые сообщения, которые должен вернуть сервер
	var message1 = chat.createMessage('userName1', 'text 1');
	var message2 = chat.createMessage('userName2', 'text 2');
	var messages = [message1, message2];
	// Заменяем реализацию server.loadMessages(), новая реализация
	// вернет предопределенные сообщения без обращения к реальному серверу
	this.stub(this.server, 'loadMessages', function(userName, callback) {
		callback(messages);
	});
	// Инициируем слежение за методом chatControl.addMessage(),
	// который добавлет сообщения в историю чата
	this.spy(this.chatControl, 'addMessage');
	
	this.chatControl.updateMessages();
	// Проверяем, что метод server.loadMessages() был вызван ровно один раз
	ok(this.server.loadMessages.calledOnce, 'server.loadMessages() не вызван');
	// Проверяем, что количество вызовов метода добавления сообщения
	// равно количеству сообщений, пришедших с сервера
	deepEqual(this.chatControl.addMessage.callCount, messages.length, 'Неправильно число вызовов chatControl.addMessage()');
	// Проверяем правильность аргументов каждого вызова
	ok(this.chatControl.addMessage.getCall(0).calledWith(message1), 'Неправильный аргумент 1-го вызова chatControl.addMessage()');
	ok(this.chatControl.addMessage.getCall(1).calledWith(message2), 'Неправильный аргумент 2-го вызова chatControl.addMessage()');
});

module('server tests', {
	setup: function() {
		this.config = {saveUrl: 'http://test.com/save', loadUrl: 'http://test.com/load'};
		this.server = chat.server(this.config);
		this.userName = 'userName1';
	},
	teardown: function() {
	}
});
test('test saveMessage()', function() {
	sinon.stub(jQuery, "ajax");
	var message = chat.createMessage(this.userName, 'text 1');
	this.server.saveMessage(message);
	ok(jQuery.ajax.calledWithMatch({ url: this.config.saveUrl }), this.config.saveUrl + ' не вызван');
	jQuery.ajax.restore();
});
test('test loadMessages()', function() {
	// Метод server.loadMessages() обращается к серверу чата
	// для получения новых сообщений для пользователя. В метод
	// должна быть передана функция обратного вызова для обработки
	// этих сообщений.

	// Создадим новые сообщения, которые должен вернуть реальный сервер чата
	var message1 = chat.createMessage(this.userName, 'text 1');
	var message2 = chat.createMessage(this.userName, 'text 2');
	var message3 = chat.createMessage(this.userName, 'text 3');
	var expectedMessages = [message1, message2, message3];
	
	// Будем использовать "поддельный" сервер от Sinon.JS
	var fakeServer = this.sandbox.useFakeServer();
	// Адрес, по которому нужно получить сообщения, должен
	// содержать имя пользователя
	var expectedUrl = this.config.loadUrl + '/' + this.userName;
	// Настраиваем ответ сервера
	fakeServer.respondWith(
		"POST",
		expectedUrl,
        [
			200,
			{ "Content-Type": "application/json" },
			JSON.stringify(expectedMessages)
		]
	);
	// Создаем заглушку для функции обратного вызова
	var callbackStub = this.stub();
	
	// Вызываем тестируемый метод
	this.server.loadMessages(this.userName, callbackStub);
	// и инициируем ответ "поддельного" сервера
	fakeServer.respond();
	
	// Проверяем правильность работы с функцией обратного вызова
	ok(callbackStub.calledOnce, 'callback вызван не один раз');
	ok(callbackStub.getCall(0).calledWith(expectedMessages), 'Неправильный аргумент вызова callback');
});