#include "../external/monero/src/common/base58.h"
#include <string>


extern "C" {
int monero_base58_encode_wrapper(void)
{
    std::string s1( "What is the sound of one clam napping?");
    std::string b = tools::base58::encode(s1);
    //return tools::base58::encode(s1).size();
    printf("blablabla");
    printf("%s",b.c_str());

    return s1.size();
}
}