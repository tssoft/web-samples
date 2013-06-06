var chat = {};

chat.quoteTool = function(textArea) {
	var getSelectedText = function() {
		var txt = '';
		if (window.getSelection) {
			txt = window.getSelection().toString();
		} else if (document.getSelection) {
			txt = document.getSelection();
		} else if (document.selection) {
			txt = document.selection.createRange().text;
		}
		return txt;
	};
	
	return {
		insertQuote: function() {
			var text = getSelectedText();
			if (text === '') {
				return;
			}
			var lines = text.split('\n');
			var quote = '';
			lines.forEach(function(element, index, array) {
				if (element !== '') {
					quote += '>> ' + element + '\n';
				};
			});
			textArea.val(textArea.val() + quote);
		}
	}
};

chat.createMessage = function(userName, text) {
	return {
		userName: userName,
		text: text
	}
};

chat.messageTool = function(config) {
	var that = this;
	return {
		addMessage: function() {
			var text = config.textArea.val();
			var message = that.createMessage(config.userName, text);
			config.chatControl.addMessage(message);
			config.textArea.val('');
			config.server.saveMessage(message);
		}
	}
}

chat.chatControl = function(config) {
	return {
		addMessage: function(message) {
			if (message.userName === '' || message.text === '') {
				return;
			}
			config.chatDiv.append('<div class="message-title"><span>' + message.userName + '</span><span>&nbsp;(' + new Date().toISOString() + ')</span></div>');
			var lines = message.text.split('\n');
			lines.forEach(function(element, index, array) {
				config.chatDiv.append('<div class="' + (element.indexOf('>>') === -1 ? 'text' : 'quote') + '">' + element + '</div>');
			});
		},
		updateMessages: function() {
			var that = this;
			config.server.loadMessages(config.userName, function(messages) {
				for(var i = 0; i < messages.length; i++) {
					that.addMessage(messages[i]);
				}
			});
		}
	}
};

chat.server = function(config) {
	return {
		saveMessage: function(message) {
			$.ajax({
				url: config.saveUrl,
				data: message
			});
		},
		loadMessages: function(userName, callback) {
			$.ajax({
				url: config.loadUrl + '/' + userName,
				type: 'POST',
				success: function(data) {
					callback(data);
				}
			});
		}
	}
};